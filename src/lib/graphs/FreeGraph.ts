import { AcceptedFileExtensions } from "@/types";
import { graph6ToMatrix } from "./graph6";

export default class FreeGraph implements Graph {
    matrix: number[][];

    constructor(fileExtension: AcceptedFileExtensions, content: string) {
        this.matrix = this.getMatrix(fileExtension, content);
    }

    private getMatrix = (fileExtension: AcceptedFileExtensions, content: string): number[][] => {
        let matrix: number[][] = [];
        console.log(fileExtension);
    
        if (fileExtension === 'g6') {
            matrix = graph6ToMatrix(content);
        } else if (fileExtension === 'txt') {
            const lines = content.split(/\s+/g);
    
            lines.forEach(line => {
                matrix.push(line.split('').map(char => Number.parseInt(char)));
            });
        }
    
        return matrix;
    }
}