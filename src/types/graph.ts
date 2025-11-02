export type GraphFile = {
    name: string,
    type: 'g6' | 'txt',
    text: string
}

export interface Graph {
    file?: GraphFile,
    matrix?: number[][],
    totalColoring?: string[][],
    showColoring?: boolean,
    layout?: string,
    renderings: number,
    class?: "completes" | "paths" | "cycles",
    fileName?: string
}

export interface GraphValues {
    file?: GraphFile,
    matrix?: number[][],
    totalColoring?: string[][],
    showColoring?: boolean,
    layout?: string,
    renderings?: number,
    class?: "completes" | "paths" | "cycles",
    fileName?: string
}