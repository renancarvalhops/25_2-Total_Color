import { AcceptedFileExtensions } from "@/types";
import Graph6 from "./Graph6";

export default class GraphFree implements Graph {
    matrix: number[][];

    constructor(fileExtension: AcceptedFileExtensions, content: string) {
        this.matrix = this.getMatrix(fileExtension, content);
    }

    private getMatrix = (fileExtension: AcceptedFileExtensions, content: string): number[][] => {
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
}