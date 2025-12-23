import { AcceptedFileExtensions } from "@/types";
import Graph6 from "graph6";

export default class GraphFree implements Graph {
    matrix: number[][];
    totalColoring?: string[][];

    constructor(fileExtension: AcceptedFileExtensions, content: string, isColored: boolean) {
        if (isColored) {
            [this.matrix, this.totalColoring] = this.getColoredMatrix(content);
        } else {
            this.matrix = this.getMatrix(fileExtension, content);
        }
    }

    private getMatrix(fileExtension: AcceptedFileExtensions, content: string): number[][] {
        let matrix: number[][] = [];

        if (fileExtension === 'g6') {
            matrix = Graph6.toMatrix(content);
        } else if (fileExtension === 'txt') {
            const lines = content.split(/\s+/g);

            lines.forEach(line => {
                matrix.push(line.split('').map(char => Number.parseInt(char)));
            });
        }

        return matrix;
    }

    private getColoredMatrix(content: string): [number[][], string[][]] {
        const lines = content.split(/\r?\n/g);
        const order = Number.parseInt(lines[0]);
        const length = Number.parseInt(lines[order + 1]);

        const matrix: number[][] = Array.from({ length: order }, () => new Array(order).fill(0));
        const totalColoring: string[][] = Array.from({ length: order }, () => new Array());


        lines.forEach((line, index) => {
            if (0 < index && index < order + 1) {
                // vertices iteration 
                const [vertex, color] = line.split(/\s+/g).map(char => Number.parseInt(char));
                totalColoring[color].push(`${vertex}`);
            } else if (order + 1 < index && index <= order + 1 + length) {
                // edges iteration
                const [vertexOrigin, vertexTarget, color] = line.split(/\s+/g).map(char => Number.parseInt(char));
                matrix[vertexOrigin][vertexTarget] = 1;
                totalColoring[color].push(`${vertexOrigin}_${vertexTarget}`);
            }
        });

        return [matrix, totalColoring];
    }
}