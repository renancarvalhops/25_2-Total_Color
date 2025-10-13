import { ElementsDefinition } from "cytoscape";
import { Collection, SingularElementArgument } from "cytoscape";
import { graph6ToMatrix } from "./graph6";
import { GraphFile } from "@/types";

type ValidatedTotalColoring = {
    hasConflict: boolean,
    adjacentElements: Collection
}

const getGraphMatrix = (graphFile: GraphFile): number[][] => {
    let matrix: number[][] = [];

    if (graphFile.type === 'g6') {
        matrix = graph6ToMatrix(graphFile.text);
    } else {
        const lines = graphFile.text.split(/\s+/g);

        lines.forEach(line => {
            matrix.push(line.split('').map(char => Number.parseInt(char)));
        });
    }

    return matrix;
}

const getGraphElements = (matrix: number[][]): ElementsDefinition => {
    const elements: ElementsDefinition = {
        nodes: [],
        edges: []
    };

    const order = matrix.length;

    for (let i = 0; i < order; i++) {
        elements.nodes.push({
            data: { id: `v${i + 1}`, hasConflict: false }
        });

        for (let j = i + 1; j < order; j++) {
            if (matrix[i][j]) {
                elements.edges.push({
                    data: { id: `v${i+1}v${j+1}`, source: `v${i+1}`, target: `v${j+1}`, hasConflict: false }
                });
            }
        }
    }
    
    return elements;
};

const validateTotalColoring = (targetElement: SingularElementArgument): ValidatedTotalColoring => {    
    let adjacentElements: Collection;

    if (targetElement.isNode()) {
        adjacentElements = targetElement.neighborhood();
    } else {
        const incidentVertices = targetElement.connectedNodes();
        const adjacentEdges = (incidentVertices.connectedEdges()).difference(targetElement);

        adjacentElements = incidentVertices.union(adjacentEdges);
    }

    const validationResult: ValidatedTotalColoring = {
        hasConflict: false,
        adjacentElements: adjacentElements
    };

    adjacentElements.forEach(adjacentElement => {
        if (
            targetElement.data('colorNumber') &&
            adjacentElement.data('colorNumber') &&
            targetElement.data('colorNumber') === adjacentElement.data('colorNumber')
        ) {
            validationResult.hasConflict = true;
        }
    });

    return validationResult;
};

export { getGraphMatrix ,getGraphElements, validateTotalColoring }