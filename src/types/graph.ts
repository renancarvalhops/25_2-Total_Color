import { ElementsDefinition } from "cytoscape";

export type GraphFile = {
    type: 'g6' | 'txt',
    text: string
}

export interface Graph {
    file?: GraphFile,
    matrix?: number[][],
    elements?: ElementsDefinition,
    layout?: string
}

export interface GraphValues extends Partial<Graph> {}