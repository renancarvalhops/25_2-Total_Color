import { mod } from "@/lib/utils";
import { GraphClass } from "./GraphClass";
import { AdjacencyMatrix, Color, Coloring, Edge, Vertex } from "../types";

export default class CompleteGraph extends GraphClass {
    constructor(n: number) {
        super(n);
    }

    getMatrix(n: number): AdjacencyMatrix {
        const matrix: AdjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(0));

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                matrix[i][j] = 1;
            }
        }

        return matrix;
    }

    getTotalColoring(n: number): Coloring {
        const isEven = mod(n, 2) === 0;
        const totalChromaticNumber = n + (isEven ? 1 : 0);
        const coloring: Coloring = new Map();

        for (let i = 0; i < totalChromaticNumber; i++) {
            const v: Vertex = `${i}`;
            const c: Color = `${i}`;

            coloring.set(v, c);

            for (let j = 1; j <= (totalChromaticNumber - 1) / 2; j++) {
                const leftIndex = mod(i - j, totalChromaticNumber);
                const rightIndex = mod(i + j, totalChromaticNumber);

                const e: Edge = `${Math.min(leftIndex, rightIndex)} ${Math.max(leftIndex, rightIndex)}`;

                coloring.set(e, c);
            }
        }

        if (isEven) {
            const aux_index = totalChromaticNumber - 1;
            const aux_v: Vertex = `${aux_index}`;
            coloring.delete(aux_v);

            for (let i = 0; i < aux_index; i++) {
                const aux_e: Edge = `${i} ${aux_index}`;
                coloring.delete(aux_e);
            }
        }

        return coloring;
    }
}