import vert from './vert.glsl'
import frag from './frag.glsl'

import { GLHandler } from '../GLHandler'
import { CreateProgram, CreateBuffer, CreateEmptyTexture2D, CreateFrameBuffer, ClearColorByValue } from '../util'

function CreateBufferHelper(gl: WebGLRenderingContext, data: number[]): WebGLBuffer {
    const buffer = CreateBuffer(gl)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(data), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return buffer
}

export class RenderTexture extends GLHandler {
    title = '渲染纹理'
    private gl: WebGLRenderingContext | null = null
    private program: WebGLProgram | null = null
    private fullsceneBuffer: WebGLBuffer | null = null
    private rotatedBuffer: WebGLBuffer | null = null
    private texture1: WebGLTexture | null = null
    private texture2: WebGLTexture | null = null
    private clearValue = 0
    private frameBuffer: WebGLFramebuffer | null = null
    private isTexutre = true
    private id: number | null = null
    private positionIndex = 0
    private uvIndex = 0;
    enter(gl: WebGLRenderingContext): void {
        this.gl = gl
        this.clearValue = 0
        this.program = CreateProgram(gl, vert, frag)
        this.fullsceneBuffer = CreateBufferHelper(gl, [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, -1, 0, 0, 1, 1, 1, 1, -1, 1, 0, 1])
        this.rotatedBuffer = CreateBufferHelper(gl, [-0.9, -1, 0, 0, 1, -0.9, 1, 0, 0.9, 1, 1, 1, -0.9, -1, 0, 0, 0.9, 1, 1, 1, -1, 0.9, 0, 1])
        this.positionIndex = gl.getAttribLocation(this.program, 'position')
        this.uvIndex = gl.getAttribLocation(this.program, 'uv')
        gl.enableVertexAttribArray(this.positionIndex)
        gl.enableVertexAttribArray(this.uvIndex)
        const texLocation = gl.getUniformLocation(this.program, 'tex')
        this.texture1 = CreateEmptyTexture2D(gl)
        this.texture2 = CreateEmptyTexture2D(gl)
        gl.activeTexture(gl.TEXTURE0)
        gl.useProgram(this.program)
        gl.uniform1i(texLocation, 0)
        this.frameBuffer = CreateFrameBuffer(gl)
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture1, 0)
        ClearColorByValue(gl, this.clearValue)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.bindTexture(gl.TEXTURE_2D, this.texture1)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.fullsceneBuffer)
        gl.vertexAttribPointer(this.positionIndex, 2, gl.FLOAT, false, 16, 0)
        gl.vertexAttribPointer(this.uvIndex, 2, gl.FLOAT, false, 16, 8)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        this.isTexutre = true
        this.id = window.setTimeout(this.render, 1000)
    }

    private render = (): void => {
        this.clearValue += .25
        let fromTexture: WebGLTexture
        let toTexture: WebGLTexture
        if (this.isTexutre) {
            fromTexture = this.texture1!
            toTexture = this.texture2!
        } else {
            toTexture = this.texture1!
            fromTexture = this.texture2!
        }
        this.isTexutre = !this.isTexutre

        const gl = this.gl!
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, toTexture, 0)
        ClearColorByValue(gl, this.clearValue)
        gl.bindTexture(gl.TEXTURE_2D, fromTexture)
        const texLocation = gl.getUniformLocation(this.program!, 'tex')
        gl.uniform1i(texLocation, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.rotatedBuffer)
        gl.vertexAttribPointer(this.positionIndex, 2, gl.FLOAT, false, 16, 0)
        gl.vertexAttribPointer(this.uvIndex, 2, gl.FLOAT, false, 16, 8)
        gl.drawArrays(gl.TRIANGLES, 0, 6)

        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.bindTexture(gl.TEXTURE_2D, toTexture)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.fullsceneBuffer)
        gl.vertexAttribPointer(this.positionIndex, 2, gl.FLOAT, false, 16, 0)
        gl.vertexAttribPointer(this.uvIndex, 2, gl.FLOAT, false, 16, 8)
        gl.drawArrays(gl.TRIANGLES, 0, 6)

        this.id = window.setTimeout(this.render, 1000)
    }

    leave(): void {
        if (this.id !== null) {
            clearTimeout(this.id)
            this.id = null
        }
        const gl = this.gl!
        gl.disableVertexAttribArray(this.positionIndex)
        gl.disableVertexAttribArray(this.uvIndex)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.deleteFramebuffer(this.frameBuffer)
        this.frameBuffer = null
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.deleteTexture(this.texture1)
        this.texture1 = null
        gl.deleteTexture(this.texture2)
        this.texture2 = null
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.deleteBuffer(this.fullsceneBuffer)
        this.fullsceneBuffer = null
        gl.deleteBuffer(this.rotatedBuffer)
        this.rotatedBuffer = null
        gl.deleteProgram(this.program)
        gl.useProgram(null)
        this.program = null
        this.gl = null
    }
}