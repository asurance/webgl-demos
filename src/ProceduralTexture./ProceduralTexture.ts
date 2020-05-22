import vert from './vert.glsl'
import frag from './frag.glsl'

import { GLHandler } from '../GLHandler'
import { CreateProgram, CreateBuffer } from '../util'

export class ProceduralTexture extends GLHandler {
    readonly title = '程序纹理';
    private gl: WebGLRenderingContext | null = null
    private program: WebGLProgram | null = null
    private vertexBuffer: WebGLBuffer | null = null
    private positionIndex = 0
    private renderId: number | null = null
    private timeLocation: WebGLUniformLocation | null = null
    private startTime = 0
    private mouseX = 0
    private mouseY = 0
    private mouseDirty = false
    private mouseLocation: WebGLUniformLocation | null = null
    enter(gl: WebGLRenderingContext): void {
        this.gl = gl
        this.program = CreateProgram(gl, vert, frag)
        this.vertexBuffer = CreateBuffer(gl)
        this.positionIndex = this.gl.getAttribLocation(this.program, 'position')
        gl.useProgram(this.program)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.of(-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1), gl.STATIC_DRAW)
        gl.enableVertexAttribArray(this.positionIndex)
        gl.vertexAttribPointer(this.positionIndex, 2, gl.FLOAT, false, 8, 0)
        const resolution = this.gl.getUniformLocation(this.program, 'u_resolution')!
        this.gl.uniform2f(resolution, this.gl.canvas.width, this.gl.canvas.height)
        this.timeLocation = this.gl.getUniformLocation(this.program, 'u_time')!
        this.mouseLocation = this.gl.getUniformLocation(this.program, 'u_mouse')!
        this.mouseX = this.mouseY = 0
        this.startTime = Date.now()
        this.render()
    }
    onmousemove(x: number, y: number): void {
        this.mouseX = x
        this.mouseY = y
        this.mouseDirty = true
    }
    onmouseover(x: number, y: number): void {
        this.mouseX = x
        this.mouseY = y
        this.mouseDirty = true
    }
    private render = (): void => {
        const now = Date.now()
        this.gl!.uniform1f(this.timeLocation, (now - this.startTime) / 1000)
        if (this.mouseDirty) {
            this.gl!.uniform2f(this.mouseLocation, this.mouseX, this.mouseY)
            this.mouseDirty = false
        }
        this.gl!.drawArrays(this.gl!.TRIANGLES, 0, 6)
        this.renderId = requestAnimationFrame(this.render)
    }
    leave(): void {
        if (this.renderId !== null) {
            cancelAnimationFrame(this.renderId)
            this.renderId = null
        }
        this.gl!.disableVertexAttribArray(this.positionIndex)
        this.gl!.useProgram(null)
        this.gl!.deleteProgram(this.program)
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, null)
        this.gl!.deleteBuffer(this.vertexBuffer)
        this.gl = null
        this.program = null
        this.vertexBuffer = null
        this.timeLocation = null
        this.mouseLocation = null
    }
}