import { ElementsDefinition } from "cytoscape"

type Graph = {
    mode: string,
    elements?: ElementsDefinition,
    matrix?: number[][],
    order?: number
}

export type { Graph }