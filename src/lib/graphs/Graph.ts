import { AdjacencyMatrix, Coloring } from "./types";

export default interface Graph {
    readonly matrix: AdjacencyMatrix;
    readonly totalColoring?: Coloring;
}