import { ElementsDefinition } from "cytoscape";

const elements: ElementsDefinition = {
    nodes: [],
    edges: []
};

const getGeneralGraph = (matrix: number[][]): ElementsDefinition => {
    const order = matrix.length;

    for (let i = 0; i < order; i++) {
        elements.nodes.push({
            data: { id: `v${i + 1}` }
        });

        for (let j = i + 1; j < order; j++) {
            if (matrix[i][j]) {
                elements.edges.push({
                    data: { id: `v${i+1}v${j+1}`, source: `v${i+1}`, target: `v${j+1}` }
                });
            }
        }
    }
    
    return elements;
};

export { getGeneralGraph }