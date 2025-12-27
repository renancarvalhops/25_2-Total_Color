import { mod } from "@/lib/utils";
import { AdjacencyMatrix, Color, Coloring, Edge, Vertex } from "../types";
import { GraphClass } from "./GraphClass";

export default class CycleGraph extends GraphClass {
    constructor(n: number) {
        super(n);
    }

    getMatrix(n: number): AdjacencyMatrix {
        const matrix: AdjacencyMatrix = Array.from({ length: n }, () => Array(n).fill(0));

        for (let i = 0; i < n - 1; i++) {
            matrix[i][i + 1] = 1;
        }

        matrix[0][n - 1] = 1;

        return matrix;
    }

    getTotalColoring(n: number): Coloring {
        const coloring: Coloring = new Map();
    
        let i = 0;
        for (i; i < 2*n - 1; i++) {
            const c: Color = `${i % 3}`;

            if (i % 2 === 0) {
                const v: Vertex = `${i / 2}`;
                coloring.set(v, c);
            } else {
                const e: Edge = `${(i - 1) / 2} ${(i + 1) / 2}`;
                coloring.set(e, c);
            }
        }
        const c: Color = `${i % 3}`;
        const e: Edge = `0 ${(i - 1) / 2}`;
        coloring.set(e, c);


        if (mod(n, 3) === 1) {
            coloring.set(`${n - 2}`, "3");
            coloring.set(`${n - 2} ${n - 1}`, "1");
            coloring.set(`${n - 1}`, "2");
            coloring.set(`0 ${n - 1}`, "3");
        } else if (mod(n, 3) === 2) {
            coloring.set(`0 ${n - 1}`, "3");
        }
    
        return coloring;
    }
}