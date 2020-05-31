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

function EnableAttrib(gl: WebGLRenderingContext, program: WebGLProgram): void {
    const positionIndex = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionIndex)
    gl.vertexAttribPointer(positionIndex, 2, gl.FLOAT, false, 16, 0)
    const uvIndex = gl.getAttribLocation(program, 'uv')
    gl.enableVertexAttribArray(uvIndex)
    gl.vertexAttribPointer(uvIndex, 2, gl.FLOAT, false, 16, 8)
}

export class RenderTexture extends GLHandler {
    title = '渲染纹理'
    private gl: WebGLRenderingContext | null = null
    private program: WebGLProgram | null = null
    private verticeBuffer: WebGLBuffer | null = null
    private verticeBuffer2: WebGLBuffer | null = null
    private texture: WebGLTexture | null = null
    private texture2: WebGLTexture | null = null
    private value = 0
    private frameBuffer: WebGLFramebuffer | null = null
    private isTexutre = true
    private id: number | null = null
    enter(gl: WebGLRenderingContext): void {
        this.gl = gl
        this.value = 0
        this.program = CreateProgram(gl, vert, frag)
        this.verticeBuffer = CreateBufferHelper(gl, [-1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, -1, 0, 0, 1, 1, 1, 1, -1, 1, 0, 1])
        this.verticeBuffer2 = CreateBufferHelper(gl, [-0.9, -1, 0, 0, 1, -0.9, 1, 0, 0.9, 1, 1, 1, -0.9, -1, 0, 0, 0.9, 1, 1, 1, -1, 0.9, 0, 1])
        const texLocation = gl.getUniformLocation(this.program, 'tex')
        this.texture = CreateEmptyTexture2D(gl)
        this.texture2 = CreateEmptyTexture2D(gl)
        gl.activeTexture(gl.TEXTURE0)
        gl.useProgram(this.program)
        gl.uniform1i(texLocation, 0)
        this.frameBuffer = CreateFrameBuffer(gl)
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
        ClearColorByValue(gl, this.value)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, this.verticeBuffer)
        EnableAttrib(gl, this.program)
        this.gl!.drawArrays(this.gl!.TRIANGLES, 0, 6)
        this.isTexutre = true
        this.id = setTimeout(this.render, 1000)
    }

    private render = (): void => {
        this.value += .25
        let texture1: WebGLTexture
        let texture2: WebGLTexture
        if (this.isTexutre) {
            texture1 = this.texture!
            texture2 = this.texture2!
        } else {
            texture2 = this.texture!
            texture1 = this.texture2!
        }
        this.isTexutre = !this.isTexutre

        this.gl!.bindFramebuffer(this.gl!.FRAMEBUFFER, this.frameBuffer)
        this.gl!.framebufferTexture2D(this.gl!.FRAMEBUFFER, this.gl!.COLOR_ATTACHMENT0, this.gl!.TEXTURE_2D, texture2, 0)
        ClearColorByValue(this.gl!, this.value)
        this.gl!.bindTexture(this.gl!.TEXTURE_2D, texture1)
        const texLocation = this.gl!.getUniformLocation(this.program!, 'tex')
        this.gl!.uniform1i(texLocation, 0)
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, this.verticeBuffer2)
        EnableAttrib(this.gl!, this.program!)
        this.gl!.drawArrays(this.gl!.TRIANGLES, 0, 6)

        this.gl!.bindFramebuffer(this.gl!.FRAMEBUFFER, null)
        this.gl!.bindTexture(this.gl!.TEXTURE_2D, texture2)
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, this.verticeBuffer)
        EnableAttrib(this.gl!, this.program!)
        this.gl!.drawArrays(this.gl!.TRIANGLES, 0, 6)

        this.id = setTimeout(this.render, 1000)
    }

    leave(): void {
        if (this.id !== null) {
            clearTimeout(this.id)
            this.id = null
        }
        this.gl!.bindFramebuffer(this.gl!.FRAMEBUFFER, null)
        this.gl!.deleteFramebuffer(this.frameBuffer)
        this.frameBuffer = null
        this.gl!.bindTexture(this.gl!.TEXTURE_2D, null)
        this.gl!.deleteTexture(this.texture)
        this.texture = null
        this.gl!.deleteTexture(this.texture2)
        this.texture2 = null
        this.gl!.bindBuffer(this.gl!.ARRAY_BUFFER, null)
        this.gl!.deleteBuffer(this.verticeBuffer)
        this.verticeBuffer = null
        this.gl!.deleteBuffer(this.verticeBuffer2)
        this.verticeBuffer2 = null
        this.gl!.deleteProgram(this.program)
        this.gl!.useProgram(null)
        this.program = null
        this.gl = null
    }
}