import { AcceptedFile } from "@/types";
import Graph6 from "graph6";
import Graph from "./Graph";
import { AdjacencyMatrix, Color, Coloring, Edge, Vertex } from "./types";

interface ConfigConstructor {
    fileExtension: AcceptedFile,
    content: string,
    isColored: boolean
}

export default class FreeGraph implements Graph {
    matrix: AdjacencyMatrix;
    totalColoring?: Coloring;

    constructor(config: ConfigConstructor | null) {
        if (config) {
            const { fileExtension, content, isColored } = config;

            if (isColored) {
                [this.matrix, this.totalColoring] = this.getColoredGraph(content);
            } else {
                this.matrix = this.getMatrix(fileExtension, content);
            }
        } else {
            this.matrix = [];
        }
    }

    private getMatrix(fileExtension: AcceptedFile, content: string): AdjacencyMatrix {
        let matrix: AdjacencyMatrix = [];

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

    public addVertex() {
        const order = this.matrix.length;
        this.matrix.push(new Array(order).fill(0));

        this.matrix = this.matrix.map((vec) => {
            vec.push(0);
            return vec;
        });
    }

    public rmVertex(vertex: number) {
        this.matrix.splice(vertex, 1);
    }

    public addEdge(source: number, target: number) {
        this.matrix[source][target] = 1;
    }

    public rmEdge(source: number, target: number) {
        this.matrix[source][target] = 0;
    }

    private getColoredGraph(content: string): [AdjacencyMatrix, Coloring] {
        const lines = content.split(/\r?\n/g);
        const order = Number.parseInt(lines[0]);
        const length = Number.parseInt(lines[order + 1]);

        const matrix: AdjacencyMatrix = Array.from({ length: order }, () => new Array(order).fill(0));
        const coloring: Coloring = new Map();

        lines.forEach((line, index) => {
            if (0 < index && index < order + 1) {
                // vertices iteration 
                const [ivertex, icolor] = line.split(/\s+/g).map(char => Number.parseInt(char));
                const v: Vertex = `${ivertex}`;
                const c: Color = `${icolor}`;

                coloring.set(v, c);
            } else if (order + 1 < index && index <= order + 1 + length) {
                // edges iteration
                const [isource, itarget, icolor] = line.split(/\s+/g).map(char => Number.parseInt(char));
                matrix[isource][itarget] = 1;
                const e: Edge = `${isource} ${itarget}`;
                const c: Color = `${icolor}`;

                coloring.set(e, c);
            }
        });

        return [matrix, coloring];
    }
}