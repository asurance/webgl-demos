export abstract class GLHandler {
    abstract title: string;
    async load?(): Promise<void>
    onmousemove?(x: number, y: number): void
    onmousedown?(x: number, y: number): void
    onmouseup?(x: number, y: number): void
    onmouseover?(x: number, y: number): void
    onmouseout?(x: number, y: number): void
    abstract enter(gl: WebGLRenderingContext): void
    abstract leave(): void
}