import { ElementsDefinition } from "cytoscape"

type Graph = {
    elements?: ElementsDefinition,
    matrix?: number[][],
    mode: string
}

export type { Graph }