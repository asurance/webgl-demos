import { GLHandler } from '../GLHandler'
import { ClearColorByValue } from '../util'

export class ClearColor extends GLHandler {
    title = '清屏'
    private gl: WebGLRenderingContext | null = null
    private renderId: number | null = null
    private startTime = 0
    enter(gl: WebGLRenderingContext): void {
        this.gl = gl
        this.startTime = Date.now()
        this.render()
    }
    private render = (): void => {
        const delta = (Date.now() - this.startTime) / 1000
        const gl = this.gl!
        ClearColorByValue(gl, delta)
        this.renderId = requestAnimationFrame(this.render)
    }
    leave(): void {
        if (this.renderId !== null) {
            cancelAnimationFrame(this.renderId)
            this.renderId = null
        }
        this.gl = null
    }
}