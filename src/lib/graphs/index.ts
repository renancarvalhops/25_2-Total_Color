import { Graph } from '@/types';
import { ElementsDefinition } from 'cytoscape';
import { getGeneralGraph } from './generalGraphs';

export * from './completeGraphs';

const generateElements = (graph: Graph): ElementsDefinition | null => {
    let elements: ElementsDefinition | null = null;

    if (graph.mode === 'free' && graph.matrix) {
        elements = getGeneralGraph(graph.matrix);
    }

    return elements;
};

export { generateElements };