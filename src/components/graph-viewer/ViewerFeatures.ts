import { GraphView, TCEdgeDataDefinition, TCNodeDataDefinition } from "@/types";
import cytoscape, { Collection, Core, ElementsDefinition, EventObject, SingularElementArgument } from "cytoscape";
import { RefObject } from "react";
import { convertToElementId, convertToElementLabel, HexadecimalColors } from "./ViewerUtils";
import GraphFree from "@/lib/graphs/GraphFree";

type ValidatedTotalColoring = {
    hasConflict: boolean,
    adjacentElements: Collection
}

const generateElements = (matrix: number[][]): ElementsDefinition => {
    const elements: ElementsDefinition = {
        nodes: [],
        edges: []
    };

    const order = matrix.length;

    for (let i = 0; i < order; i++) {
        const nodeData: TCNodeDataDefinition = {
            id: `v${i + 1}`,
            hasConflict: false,
            elementColor: ''
        };

        elements.nodes.push({
            data: nodeData
        });

        for (let j = i + 1; j < order; j++) {
            if (matrix[i][j]) {
                const edgedata: TCEdgeDataDefinition = {
                    id: `v${i + 1}v${j + 1}`,
                    source: `v${i + 1}`,
                    target: `v${j + 1}`,
                    hasConflict: false,
                    elementColor: ''
                };

                elements.edges.push({
                    data: edgedata
                });
            }
        }
    }

    return elements;
};

const createVertex = (event: EventObject, graph: Graph) => {
    if (event.originalEvent.altKey && graph instanceof GraphFree) {
        const nodeData: TCNodeDataDefinition = {
            id: convertToElementId(graph.matrix.length),
            hasConflict: false,
            elementColor: ''
        };
    
        event.cy.add({
            data: nodeData,
            position: event.position
        });

        graph.addVertex();
    }
};

const createEdge = (event: EventObject, graph: Graph) => {
    const element: SingularElementArgument = event.target;

    const keypressHandler = (kbEvent: KeyboardEvent) => {
        const key = kbEvent.key;
        const cy = event.cy;
        const nodesSelected = cy.nodes(':selected');

        if ((key === 'e' || key === 'E') && nodesSelected.length === 2 && graph instanceof GraphFree) {
            const sourceId = nodesSelected[0].id();
            const targetId = nodesSelected[1].id();
            const edgeId = `${sourceId}${targetId}`

            const edgedata: TCEdgeDataDefinition = {
                id: edgeId,
                source: sourceId,
                target: targetId,
                hasConflict: false,
                elementColor: ''
            };

            if (cy.$id(edgeId).length === 0) {
                cy.add({
                    data: edgedata
                });

                graph.addEdge(convertToElementLabel(sourceId), convertToElementLabel(targetId));
            }

            nodesSelected.unselect();
        } 
    }

    window.addEventListener('keypress', keypressHandler);

    element.off('unselect');

    element.on('unselect', () => {
        window.removeEventListener('keypress', keypressHandler);
    });    
};

const hexColorsCssClasses = HexadecimalColors.getAll().map((hexColor) => ({
    selector: `.${hexColor.replace('#', '')}`,
    style: {
        'color': hexColor,
        'border-color': hexColor,
        'line-color': hexColor,
        'text-border-color': hexColor
    }
}));

const generateVisualization = (graph: Graph, graphView: GraphView, containerRef: RefObject<HTMLDivElement | null>): Core => {
    const baseHexColor = '#526D82';
    const conflictHexColor = '#F00';
    const selectedHexColor = '#48B3AF';

    return cytoscape({
        container: containerRef.current,
        elements: generateElements(graph.matrix),
        style: [
            {
                selector: '*',
                style: {
                    'color': baseHexColor,
                    'font-size': '16px',
                    'font-weight': 'bold',
                    'transition-duration': 1
                }
            },
            {
                selector: 'node',
                style: {
                    'background-color': '#FFF',
                    'border-color': baseHexColor,
                    'border-width': 2,
                    'height': '40px',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'width': '40px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'line-color': baseHexColor,
                    'text-background-color': '#FFF',
                    'text-background-padding': '5px',
                    'text-background-opacity': 1,
                    'text-border-color': baseHexColor,
                    'text-border-opacity': 1,
                    'text-border-width': 2,
                    'width': 5
                }
            },
            ...hexColorsCssClasses,
            {
                selector: '[?hasConflict]',
                style: {
                    'background-color': conflictHexColor,
                    'border-color': conflictHexColor,
                    'color': '#FFF',
                    'font-weight': 'bold',
                    'line-color': conflictHexColor,
                    'text-background-color': conflictHexColor,
                    'text-border-color': conflictHexColor,
                }
            },
            {
                selector: ':selected',
                style: {
                    'background-color': selectedHexColor,
                    'border-color': selectedHexColor,
                    'color': '#FFF',
                    'font-weight': 'bold',
                    'line-color': selectedHexColor,
                    'text-background-color': selectedHexColor,
                    'text-border-color': selectedHexColor
                }
            }
        ],
        layout: {
            name: graphView.layout || 'circle',
        }
    });
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
            targetElement.data('elementColor') &&
            adjacentElement.data('elementColor') &&
            targetElement.data('elementColor') === adjacentElement.data('elementColor')
        ) {
            validationResult.hasConflict = true;
        }
    });

    return validationResult;
};

const showColoringValidation = (element: SingularElementArgument) => {
    const { hasConflict, adjacentElements } = validateTotalColoring(element);
    element.data('hasConflict', hasConflict);

    adjacentElements.forEach(adjacentElement => {
        const { hasConflict } = validateTotalColoring(adjacentElement);
        adjacentElement.data('hasConflict', hasConflict);
    });
};

const assignElementColor = (event: EventObject, updateColor: (elementId: string, previousColor: string, currentColor: string) => void) => {
    const element: SingularElementArgument = event.target;
    let isFirstKeyPress = true;
    const previousColor = element.data('elementColor');

    const keydownHandler = (event: KeyboardEvent) => {
        const key = event.key;

        if (key === 'Backspace') {
            const elementColor = element.data('elementColor');

            element.data('elementColor', elementColor.substring(0, elementColor.length - 1));
            element.style('label', element.data('elementColor'));
        }
    }

    const keypressHandler = (event: KeyboardEvent) => {
        const key = event.key;
        const isNumber = /\d/g;

        if (isNumber.test(key)) {
            if (isFirstKeyPress) {
                isFirstKeyPress = false;

                element.data('elementColor', key);
            } else {
                element.data('elementColor', element.data('elementColor') + key);
            }

            element.style('label', element.data('elementColor'));
        } else if (key === 'Enter') {
            element.unselect();
        }
    }

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keypress', keypressHandler);

    element.off('unselect');

    element.on('unselect', () => {
        const currentColor = element.data('elementColor');
        const elementId = element.data('id');

        element.classes('');

        if (currentColor) {
            element.addClass(HexadecimalColors.getWithoutHash(Number(currentColor)));
        }

        updateColor(elementId, previousColor, currentColor);

        window.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('keypress', keypressHandler);

        showColoringValidation(element);
    });
};

const showColoring = (
    cy: Core,
    graph: Graph,
    graphView: GraphView,
    updateColor: (elementId: string, previousColor: string, currentColor: string) => void
) => {
    if (!graphView.coloring || !graph.totalColoring) {
        return;
    }

    const coloring: { color: number, elementLabel: string }[] = [];

    if (graphView.coloring.orientation === 'color') {
        graph.totalColoring.forEach((elementsLabels, color) => {
            elementsLabels.forEach((elementLabel) => {
                coloring.push({ color, elementLabel });
            });
        });
    } else if (graphView.coloring.orientation === 'index') {
        const maxElementsLabels = graph.totalColoring.reduce((prev, curr) => (
            prev.length > curr.length ? prev : curr
        ));

        const maxElementIndex = maxElementsLabels.length - 1;
        const maxColorIndex = graph.totalColoring.length - 1;

        for (let elementIndex = 0; elementIndex <= maxElementIndex; elementIndex++) {
            for (let colorIndex = 0; colorIndex <= maxColorIndex; colorIndex++) {
                if (elementIndex < graph.totalColoring[colorIndex].length) {
                    coloring.push({ color: colorIndex, elementLabel: graph.totalColoring[colorIndex][elementIndex] });
                }
            }
        }
    }

    let index = 0;

    const intervalId = setInterval(() => {
        if (index >= coloring.length) {
            clearInterval(intervalId);
            return;
        }

        const { color, elementLabel } = coloring[index];

        const element = cy.$id(convertToElementId(elementLabel));
        const previousColor = element.data('elementColor');
        const currentColor = String(color + 1);

        element.data('elementColor', currentColor);
        element.style('label', element.data('elementColor'));
        element.classes('');
        element.addClass(HexadecimalColors.getWithoutHash(color));

        updateColor(element.data('id'), previousColor, currentColor);

        index++;
    }, 1500);

    return intervalId;
};

export { generateVisualization, assignElementColor, showColoring, createVertex, createEdge }