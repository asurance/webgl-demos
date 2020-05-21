import { GLHandler } from '../GLHandler'

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
        let r = 0
        let g = 0
        let b = 0
        const rest = delta % 1
        switch (Math.floor(delta % 6)) {
            case 0:
                r = 1
                b = 1 - rest
                break
            case 1:
                r = 1
                g = rest
                break
            case 2:
                r = 1 - rest
                g = 1
                break
            case 3:
                g = 1
                b = rest
                break
            case 4:
                g = 1 - rest
                b = 1
                break
            case 5:
                r = rest
                b = 1
                break
        }
        this.gl!.clearColor(r, g, b, 1)
        this.gl!.clear(this.gl!.COLOR_BUFFER_BIT)
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