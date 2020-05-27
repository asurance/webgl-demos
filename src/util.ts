interface ElementMap {
    'main-container': HTMLDivElement;
    'title-container': HTMLDivElement;
    'canvas-container': HTMLDivElement;
    canvas: HTMLCanvasElement;
}

export function GetElementById<T extends keyof ElementMap>(id: T): ElementMap[T] {
    return document.getElementById(id) as ElementMap[T]
}

export function ParseError(error: unknown): string {
    if (typeof error === 'string') {
        return error
    } else if (error instanceof Error) {
        return error.message
    } else {
        return 'Unknown Error'
    }
}

export function CreateProgram(gl: WebGLRenderingContext, vertex: string, fragment: string): WebGLProgram {
    const vertShader = gl.createShader(gl.VERTEX_SHADER)
    if (vertShader) {
        gl.shaderSource(vertShader, vertex)
        gl.compileShader(vertShader)
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            const infoLog = gl.getShaderInfoLog(vertShader)
            gl.deleteShader(vertShader)
            throw new Error(`vertexshader编译出错:${infoLog}`)
        }
    } else {
        throw new Error('创建vertexshader时出错')
    }
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    if (fragShader) {
        gl.shaderSource(fragShader, fragment)
        gl.compileShader(fragShader)
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            const infoLog = gl.getShaderInfoLog(fragShader)
            gl.deleteShader(vertShader)
            gl.deleteShader(fragShader)
            throw new Error(`fragShader编译出错:${infoLog}`)
        }
    } else {
        throw new Error('创建fragShader时出错')
    }
    const program = gl.createProgram()
    if (program) {
        gl.attachShader(program, vertShader)
        gl.attachShader(program, fragShader)
        gl.linkProgram(program)
        gl.deleteShader(vertShader)
        gl.deleteShader(fragShader)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const infoLog = gl.getProgramInfoLog(program)
            gl.deleteProgram(program)
            throw new Error(`program链接出错:${infoLog}`)
        }
    } else {
        throw new Error('创建program时出错')
    }
    return program
}

export function CreateBuffer(gl: WebGLRenderingContext): WebGLBuffer {
    const buffer = gl.createBuffer()
    if (buffer) {
        return buffer
    } else {
        throw new Error('创建buffer时出错')
    }
}

export function CreateTexture2D(gl: WebGLRenderingContext, source: HTMLImageElement): WebGLTexture {
    const texture = gl.createTexture()
    if (texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.bindTexture(gl.TEXTURE_2D, null)
        return texture
    } else {
        throw new Error('创建texture时出错')
    }
}

export function LoadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(resolve => {
        const image = new Image()
        image.onload = resolve.bind(null, image)
        image.src = url
    })
}

export function LoadBin(url: string): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>(resolve => {
        const request = new XMLHttpRequest()
        request.open('GET', url)
        request.responseType = 'arraybuffer'
        request.onload = (): void => resolve(request.response)
        request.send()
    })
}

export function GetProjection(angle: number, a: number, zMin: number, zMax: number): number[] {
    const tan = Math.tan(angle * Math.PI / 360)
    const A = -(zMax + zMin) / (zMax - zMin)
    const B = (-2 * zMax * zMin) / (zMax - zMin)
    return [
        1 / tan / 2, 0, 0, 0,
        0, a / tan / 2, 0, 0,
        0, 0, A, -1,
        0, 0, B, 0
    ]
}

export function GetTranslation(x: number, y: number, z: number): number[] {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1,
    ]
}
export function GetRotateX(angle: number): number[] {
    const cos = Math.cos(angle / 180 * Math.PI)
    const sin = Math.sin(angle / 180 * Math.PI)
    return [
        1, 0, 0, 0,
        0, cos, sin, 0,
        0, -sin, cos, 0,
        0, 0, 0, 1,
    ]
}
export function GetRotateY(angle: number): number[] {
    const cos = Math.cos(angle / 180 * Math.PI)
    const sin = Math.sin(angle / 180 * Math.PI)
    return [
        cos, 0, -sin, 0,
        0, 1, 0, 0,
        sin, 0, cos, 0,
        0, 0, 0, 1,
    ]
}
export function GetRotateZ(angle: number): number[] {
    const cos = Math.cos(angle / 180 * Math.PI)
    const sin = Math.sin(angle / 180 * Math.PI)
    return [
        cos, sin, 0, 0,
        -sin, cos, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]
}