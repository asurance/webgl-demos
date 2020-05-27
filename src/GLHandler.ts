export abstract class GLHandler {
    abstract readonly title: string;
    async load?(): Promise<void>
    onmousemove?(x: number, y: number): void
    onmousedown?(x: number, y: number): void
    onmouseup?(x: number, y: number): void
    onmouseover?(x: number, y: number): void
    onmouseout?(x: number, y: number): void
    test?(gl: WebGLRenderingContext): boolean
    abstract enter(gl: WebGLRenderingContext): void
    abstract leave(): void
}