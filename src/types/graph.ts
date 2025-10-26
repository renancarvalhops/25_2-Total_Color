export type GraphFile = {
    type: 'g6' | 'txt',
    text: string
}

export interface Graph {
    file?: GraphFile,
    matrix?: number[][],
    totalColoring?: string[][],
    layout?: string,
    renderings: number,
    class?: "completes"
}

export interface GraphValues {
    file?: GraphFile,
    matrix?: number[][],
    totalColoring?: string[][],
    layout?: string,
    renderings?: number,
    class?: "completes"
}