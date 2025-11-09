export abstract class GraphClass implements Graph {
    matrix: number[][];
    totalColoring: string[][];

    constructor(order: number) {
        this.matrix = this.getMatrix(order);
        this.totalColoring = this.getTotalColoring(order);
    }

    protected abstract getMatrix(order: number): number[][];
    protected abstract getTotalColoring(order: number): string[][];
}