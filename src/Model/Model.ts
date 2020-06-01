import dragonImage from './dragon.png'
import dragonBin from './dragon.bin'
import vert from './vert.glsl'
import frag from './frag.glsl'

import { GLHandler } from '../GLHandler'
import { LoadImage, LoadBin, CreateBuffer, CreateProgram, CreateTexture2D, GetTranslation, GetProjection, GetRotateY } from '../util'


export class Model implements GLHandler {
    title = '模型'
    private gl: WebGLRenderingContext | null = null
    private dragonImage: HTMLImageElement | null = null
    private dragonTexture: WebGLTexture | null = null
    private vertice: Float32Array | null = null
    private verticeBuffer: WebGLBuffer | null = null
    private indice: Uint32Array | null = null
    private indiceBuffer: WebGLBuffer | null = null
    private program: WebGLProgram | null = null
    private positionIndex = 0
    private uvIndex = 0
    private mLocation: WebGLUniformLocation | null = null
    private renderId: number | null = null
    private startTime = 0
    async load(): Promise<void> {
        const [image, buffer] = await Promise.all([LoadImage(dragonImage), LoadBin(dragonBin)])
        this.dragonImage = image
        const view = new DataView(buffer)
        const verticeCount = view.getUint32(0, true)
        const indiceCount = view.getUint32(4, true)
        this.vertice = new Float32Array(verticeCount)
        this.indice = new Uint32Array(indiceCount)
        for (let i = 0; i < verticeCount; i++) {
            this.vertice[i] = view.getFloat32((8 + 4 * i), true)
        }
        const indiceStart = 8 + 4 * verticeCount
        for (let i = 0; i < indiceCount; i++) {
            this.indice[i] = view.getUint32(indiceStart + 4 * i, true)
        }
    }
    test(gl: WebGLRenderingContext): boolean {
        const ext = gl.getExtension('OES_element_index_uint')
        if (ext) {
            return true
        } else {
            console.log('该浏览器不支持OES_element_index_uint拓展!')
            return false
        }
    }

    enter(gl: WebGLRenderingContext): boolean {
        this.gl = gl
        this.verticeBuffer = CreateBuffer(gl)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticeBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertice, gl.STATIC_DRAW)
        this.indiceBuffer = CreateBuffer(gl)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indiceBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indice, gl.STATIC_DRAW)
        this.program = CreateProgram(gl, vert, frag)
        gl.useProgram(this.program)
        gl.activeTexture(gl.TEXTURE0)
        this.dragonTexture = CreateTexture2D(gl, this.dragonImage!)
        gl.bindTexture(gl.TEXTURE_2D, this.dragonTexture)
        this.positionIndex = gl.getAttribLocation(this.program, 'position')
        gl.enableVertexAttribArray(this.positionIndex)
        gl.vertexAttribPointer(this.positionIndex, 3, gl.FLOAT, false, 20, 0)
        this.uvIndex = gl.getAttribLocation(this.program, 'uv')
        gl.enableVertexAttribArray(this.uvIndex)
        gl.vertexAttribPointer(this.uvIndex, 2, gl.FLOAT, false, 20, 12)
        const texLocation = gl.getUniformLocation(this.program, 'tex')!
        gl.uniform1i(texLocation, 0)
        this.mLocation = gl.getUniformLocation(this.program, 'm')
        const vLocation = gl.getUniformLocation(this.program, 'v')
        const v = GetTranslation(0, -4, -20)
        gl.uniformMatrix4fv(vLocation, false, v)
        const pLocation = gl.getUniformLocation(this.program, 'p')
        const p = GetProjection(40, gl.canvas.width / gl.canvas.height, 1, 100)
        gl.uniformMatrix4fv(pLocation, false, p)
        this.startTime = Date.now()
        this.gl.clearColor(0, 0, 0, 1)
        gl.enable(gl.CULL_FACE)
        gl.enable(gl.DEPTH_TEST)
        this.render()
        return true
    }
    private render = (): void => {
        const gl = this.gl!
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        const now = Date.now()
        const angle = (now - this.startTime) / 1000 * 60
        gl.uniformMatrix4fv(this.mLocation, false, GetRotateY(angle))
        gl.drawElements(gl.TRIANGLES, this.indice!.length, gl.UNSIGNED_INT, 0)
        this.renderId = requestAnimationFrame(this.render)
    }
    leave(): void {
        const gl = this.gl!
        gl.disable(gl.CULL_FACE)
        gl.disable(gl.DEPTH_TEST)
        if (this.renderId !== null) {
            cancelAnimationFrame(this.renderId)
            this.renderId = null
        }
        gl.disableVertexAttribArray(this.positionIndex)
        gl.disableVertexAttribArray(this.uvIndex)
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.deleteTexture(this.dragonTexture)
        this.dragonTexture = null
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.deleteBuffer(this.verticeBuffer)
        this.verticeBuffer = null
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
        gl.deleteBuffer(this.indiceBuffer)
        this.indiceBuffer = null
        gl.useProgram(null)
        gl.deleteProgram(this.program)
        this.mLocation = null
        this.program = null
        this.gl = null
    }
}