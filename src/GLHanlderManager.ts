import { ProceduralTexture } from './ProceduralTexture./ProceduralTexture'
import { ClearColor } from './ClearColor/ClearColor'
import { Mask } from './Mask/Mask'
import { Model } from './Model/Model'
import type { GLHandler } from './GLHandler'

export class GLHandlerManager {
    private handlers: GLHandler[]
    private titles: HTMLButtonElement[]
    private gl: WebGLRenderingContext
    private curIndex = -1
    constructor(titleContainer: HTMLDivElement, private canvas: HTMLCanvasElement) {
        const gl = canvas.getContext('webgl', { stencil: true })
        if (gl) {
            this.gl = gl
        } else {
            throw new Error('无法获取到webgl上下文')
        }
        this.handlers = [
            new ClearColor(),
            new ProceduralTexture(),
            new Mask(),
            new Model(),
        ]
        this.titles = this.handlers.map((h, i) => {
            const title = document.createElement('button')
            if (h.test && !h.test(gl)) {
                title.disabled = true
            } else {
                if (h.load) {
                    title.disabled = true
                    h.load().then(() => {
                        title.disabled = false
                    })
                } else {
                    title.disabled = false
                }
            }
            title.innerText = h.title
            title.onclick = (): void => {
                this.setActiveIndex(i)
            }
            titleContainer.appendChild(title)
            return title
        })
        this.setActiveIndex(0)
    }

    private setActiveIndex(index: number): void {
        if (this.curIndex !== index) {
            if (this.curIndex >= 0) {
                this.handlers[this.curIndex].leave()
                this.titles[this.curIndex].removeAttribute('select')
                this.canvas.onmousemove = null
                this.canvas.onmousedown = null
                this.canvas.onmouseup = null
                this.canvas.onmouseover = null
                this.canvas.onmouseout = null
            }
            this.titles[index].setAttribute('select', '')
            const handler = this.handlers[index]
            handler.onmousemove && (this.canvas.onmousemove = (ev): void => {
                handler.onmousemove!(ev.offsetX, ev.offsetY)
            })
            handler.onmousedown && (this.canvas.onmousedown = (ev): void => {
                handler.onmousedown!(ev.offsetX, ev.offsetY)
            })
            handler.onmouseup && (this.canvas.onmouseup = (ev): void => {
                handler.onmouseup!(ev.offsetX, ev.offsetY)
            })
            handler.onmouseover && (this.canvas.onmouseover = (ev): void => {
                handler.onmouseover!(ev.offsetX, ev.offsetY)
            })
            handler.onmouseout && (this.canvas.onmouseout = (ev): void => {
                handler.onmouseout!(ev.offsetX, ev.offsetY)
            })
            handler.enter(this.gl)
            this.curIndex = index
        }
    }
}