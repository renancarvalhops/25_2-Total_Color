import Graph from "../Graph";
import { AdjacencyMatrix, Coloring } from "../types";

export abstract class GraphClass implements Graph {
    matrix: AdjacencyMatrix;
    totalColoring: Coloring;

    constructor(n: number) {
        this.matrix = this.getMatrix(n);
        this.totalColoring = this.getTotalColoring(n);
    }

    protected abstract getMatrix(n: number): AdjacencyMatrix;
    protected abstract getTotalColoring(n: number): Coloring;
}