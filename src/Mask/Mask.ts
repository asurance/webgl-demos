import water from './water.jpg'
import vert from './vert.glsl'
import frag from './frag.glsl'
import mask from './mask.glsl'

import { GLHandler } from '../GLHandler'
import { LoadImage, CreateProgram, CreateTexture2D, CreateBuffer } from '../util'

export class Mask extends GLHandler {
    title = '遮罩'
    private gl: WebGLRenderingContext | null = null
    private water: HTMLImageElement | null = null
    private waterProgram: WebGLProgram | null = null
    private maskProgram: WebGLProgram | null = null
    private waterTexture: WebGLTexture | null = null
    private waterBuffer: WebGLBuffer | null = null
    private maskBuffer: WebGLBuffer | null = null
    private waterP = 0
    private maskP = 0
    private waterUV = 0
    private maskUV = 0
    private enabled: number[] = []

    async load(): Promise<void> {
        this.water = await LoadImage(water)
    }
    enter(gl: WebGLRenderingContext): void {
        this.gl = gl
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        this.waterProgram = CreateProgram(gl, vert, frag)
        this.maskProgram = CreateProgram(gl, vert, mask)
        gl.activeTexture(gl.TEXTURE0)
        this.waterTexture = CreateTexture2D(gl, this.water!)
        this.waterBuffer = CreateBuffer(gl)
        this.maskBuffer = CreateBuffer(gl)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.waterBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.of(-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, -1, 0, 0, 1, 1, 1, 1, -1, 1, 0, 1), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.maskBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, 96, gl.DYNAMIC_DRAW)
        this.waterP = gl.getAttribLocation(this.waterProgram, 'position')
        this.maskP = gl.getAttribLocation(this.maskProgram, 'position')
        this.waterUV = gl.getAttribLocation(this.waterProgram, 'uv')
        this.maskUV = gl.getAttribLocation(this.maskProgram, 'uv')
        const texLocation = gl.getUniformLocation(this.waterProgram, 'tex')
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.waterTexture)
        gl.useProgram(this.waterProgram)
        gl.uniform1i(texLocation, 0)
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)
        gl.enable(gl.STENCIL_TEST)
        this.render(0.5, 0.5)
    }

    private render(x: number, y: number): void {
        x = x * 2 - 1
        y = 1 - y * 2
        const gl = this.gl!
        gl.clear(gl.STENCIL_BUFFER_BIT)
        gl.colorMask(false, false, false, false)
        gl.stencilFunc(gl.ALWAYS, 1, 0xFF)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.maskBuffer)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, Float32Array.of(
            x - .1, y - .1, 0, 1, x + .1, y - .1, 1, 1, x + .1, y + .1, 1, 0, x - .1, y - .1, 0, 1, x + .1, y + .1, 1, 0, x - .1, y + .1, 0, 0
        ))
        gl.useProgram(this.maskProgram)
        this.enable([this.maskP, this.maskUV])
        gl.vertexAttribPointer(this.maskP, 2, gl.FLOAT, false, 16, 0)
        gl.vertexAttribPointer(this.maskUV, 2, gl.FLOAT, false, 16, 8)
        gl.drawArrays(gl.TRIANGLES, 0, 6)

        gl.colorMask(true, true, true, true)
        gl.stencilFunc(gl.EQUAL, 1, 0xFF)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.waterBuffer)
        gl.useProgram(this.waterProgram)
        this.enable([this.waterP, this.waterUV])
        gl.vertexAttribPointer(this.waterP, 2, gl.FLOAT, false, 16, 0)
        gl.vertexAttribPointer(this.waterUV, 2, gl.FLOAT, false, 16, 8)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    onmouseover(x: number, y: number): void {
        const gl = this.gl!
        this.render(x / gl.canvas.width, y / gl.canvas.height)
    }

    onmousemove(x: number, y: number): void {
        const gl = this.gl!
        this.render(x / gl.canvas.width, y / gl.canvas.height)
    }

    leave(): void {
        const gl = this.gl!
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
        gl.disable(gl.STENCIL_TEST)
        gl.useProgram(null)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.deleteProgram(this.waterProgram)
        gl.deleteProgram(this.maskProgram)
        gl.deleteTexture(this.waterTexture)
        gl.deleteBuffer(this.waterBuffer)
        gl.deleteBuffer(this.maskBuffer)
        this.enable([])
        this.gl = null
        this.waterProgram = null
        this.maskProgram = null
        this.waterTexture = null
    }

    private enable(indice: number[]): void {
        const gl = this.gl!
        const needEnable = indice.filter((v) => this.enabled.indexOf(v) < 0)
        const needDisable = this.enabled.filter((v) => indice.indexOf(v) < 0)
        needEnable.forEach((v) => gl.enableVertexAttribArray(v))
        needDisable.forEach((v) => gl.disableVertexAttribArray(v))
        this.enabled = indice
    }
}