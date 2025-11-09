import { GraphView } from "@/types";
import cytoscape, { Collection, Core, ElementsDefinition, EventObject, SingularElementArgument } from "cytoscape";
import { RefObject } from "react";
import { convertToElementId, HexadecimalColors } from "./ViewerUtils";

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
        elements.nodes.push({
            data: {
                id: `v${i + 1}`,
                hasConflict: false,
                colorNumber: ''
            }
        });

        for (let j = i + 1; j < order; j++) {
            if (matrix[i][j]) {
                elements.edges.push({
                    data: {
                        id: `v${i + 1}v${j + 1}`,
                        source: `v${i + 1}`,
                        target: `v${j + 1}`,
                        hasConflict: false,
                        colorNumber: ''
                    }
                });
            }
        }
    }

    return elements;
};

const generateVisualization = (graph: Graph, graphView: GraphView, containerRef: RefObject<HTMLDivElement | null>): Core => {
    const baseColor = '#526D82';

    return cytoscape({
        container: containerRef.current,
        elements: generateElements(graph.matrix),
        style: [
            {
                selector: '*',
                style: {
                    'color': baseColor,
                    'font-size': '16px',
                    'transition-duration': 1
                }
            },
            {
                selector: 'node',
                style: {
                    'background-color': '#FFF',
                    'border-color': baseColor,
                    'border-width': 2,
                    'font-weight': 'lighter',
                    'height': '40px',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'width': '40px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'line-color': baseColor,
                    'text-background-color': '#FFF',
                    'text-background-padding': '5px',
                    'text-background-opacity': 1,
                    'text-border-color': baseColor,
                    'text-border-opacity': 1,
                    'text-border-width': 2,
                    'width': 5
                }
            },
            {
                selector: '[?hasConflict]',
                style: {
                    'background-color': '#DC143C',
                    'line-color': '#DC143C',
                }
            },
            {
                selector: ':selected',
                style: {
                    'background-color': '#48B3AF',
                    'color': '#EEE',
                    'line-color': '#48B3AF',
                }
            },
            {
                selector: '.highlated',
                style: {
                    'background-color': '#FAA533',
                    'color': '#F3F2EC',
                    'line-color': '#FAA533'
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
            targetElement.data('colorNumber') &&
            adjacentElement.data('colorNumber') &&
            targetElement.data('colorNumber') === adjacentElement.data('colorNumber')
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

const assignColorNumber = (event: EventObject, updateColor: (elementId: string, previousColor: string, currentColor: string) => void) => {
    const element: SingularElementArgument = event.target;
    let isFirstKeyPress = true;
    const previousColor = element.data('colorNumber');

    const keydownHandler = (event: KeyboardEvent) => {
        const key = event.key;

        if (key === 'Backspace') {
            const colorNumber = element.data('colorNumber');

            element.data('colorNumber', colorNumber.substring(0, colorNumber.length - 1));
            element.style('label', element.data('colorNumber'));
        }
    }

    const keypressHandler = (event: KeyboardEvent) => {
        const key = event.key;
        const isNumber = /\d/g;

        if (isNumber.test(key)) {
            if (isFirstKeyPress) {
                isFirstKeyPress = false;

                element.data('colorNumber', key);
            } else {
                element.data('colorNumber', element.data('colorNumber') + key);
            }

            element.style('label', element.data('colorNumber'));
        } else {
            element.unselect();
        }      
    }

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keypress', keypressHandler);

    element.off('unselect');
    
    element.on('unselect', () => {
        const currentColor = element.data('colorNumber');
        const elementId = element.data('id');
        const color = Number(currentColor) - 1;

        element.style('color', HexadecimalColors.get(color));
        element.style('border-color', HexadecimalColors.get(color));
        element.style('line-color', HexadecimalColors.get(color));
        element.style('text-border-color', HexadecimalColors.get(color));

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

    let counter = 0;

    const showColor = (color: number, elementLabel: string) => {
        setTimeout(() => {
            const element = cy.$id(convertToElementId(elementLabel));
            const previousColor = element.data('colorNumber');
            const currentColor = String(color + 1);

            element.data('colorNumber', currentColor);
            element.style('label', element.data('colorNumber'));
            element.style('color', HexadecimalColors.get(color));
            element.style('border-color', HexadecimalColors.get(color));
            element.style('line-color', HexadecimalColors.get(color));
            element.style('text-border-color', HexadecimalColors.get(color));

            updateColor(element.data('id'), previousColor, currentColor);
        }, 1500 * counter);

        counter++;
    };

    if (graphView.coloring.orientation === 'color') {
        graph.totalColoring.forEach((elementsLabels, color) => {
            elementsLabels.forEach((elementLabel) => {
                showColor(color, elementLabel);
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
                    showColor(colorIndex, graph.totalColoring[colorIndex][elementIndex]);
                }
            }
        }
    }
};

export { generateVisualization, assignColorNumber, showColoring }