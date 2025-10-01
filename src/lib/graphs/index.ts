import { Graph } from '@/types';
import { ElementsDefinition } from 'cytoscape';
import { getGeneralGraph } from './generalGraphs';
import { getCompleteGraph } from './completeGraphs';

const generateElements = (graph: Graph): ElementsDefinition | null => {
    let elements: ElementsDefinition | null = null;

    if (graph.mode === 'free' && graph.matrix) {
        elements = { ...getGeneralGraph(graph.matrix) };
    } else if (graph.mode === 'classes' && graph.order) {
        elements = { ...getCompleteGraph(graph.order) }
    }

    return elements;
};

export { generateElements };