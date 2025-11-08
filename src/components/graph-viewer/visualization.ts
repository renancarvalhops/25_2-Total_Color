import { validateTotalColoring } from "@/lib/graphs";
import { Graph } from "@/types";
import cytoscape, { Core, ElementsDefinition, EventObject, SingularElementArgument } from "cytoscape";
import { RefObject } from "react";

const generateVisualization = (graph: Graph, containerRef: RefObject<HTMLDivElement | null>): Core | null => {
    const baseColor = '#526D82';

    if (graph.matrix) {
        const cy = cytoscape({
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
                name: graph.layout || 'circle',
            }
        });
    
        return cy;
    } else {
        return null;
    }
};

const generateElements = (matrix: number[][]): ElementsDefinition => {
    const elements: ElementsDefinition = {
        nodes: [],
        edges: []
    };

    const order = matrix.length;

    for (let i = 0; i < order; i++) {
        // generate verteces
        elements.nodes.push({
            data: {
                id: `v${i + 1}`,
                hasConflict: false,
                colorNumber: ''
            }
        });

        // generate edges
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

        element.style('color', colors[(Number(currentColor) - 1) % colors.length]);
        element.style('border-color', colors[(Number(currentColor) - 1) % colors.length]);
        element.style('line-color', colors[(Number(currentColor) - 1) % colors.length]);
        element.style('text-border-color', colors[(Number(currentColor) - 1) % colors.length]);

        updateColor(elementId, previousColor, currentColor);

        window.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('keypress', keypressHandler);

        showColoringValidation(element);
    });
};

const showColoringValidation = (element: SingularElementArgument) => {
    const { hasConflict, adjacentElements } = validateTotalColoring(element);
    element.data('hasConflict', hasConflict);

    adjacentElements.forEach(adjacentElement => {
        const { hasConflict } = validateTotalColoring(adjacentElement);
        adjacentElement.data('hasConflict', hasConflict);
    });
};

const convertToElementId = (elementLabel: string): string => {
    const labelParts = elementLabel.split('_');

    const elementId = labelParts.length === 2 ?
        `v${Number(labelParts[0]) + 1}v${Number(labelParts[1]) + 1}` :
        `v${Number(labelParts[0]) + 1}`;
    
    return elementId;
};

export const colors = [
    '#eb3b5a',
    '#3867d6',
    '#fa8231',
    '#20bf6b',
    '#8854d0',
    '#f7b731',
    '#a5b1c2',
    '#4c3a2c',
    '#000000'
];

const showColoring = (
    cy: Core,
    totalColoring: string[][],
    updateColor: (elementId: string, previousColor: string, currentColor: string) => void,
    orientation: "color" | "index"
) => {
    let counter = 0;

    const showColor = (color: number, elementLabel: string) => {
        setTimeout(() => {
            const element = cy.$id(convertToElementId(elementLabel));
            const previousColor = element.data('colorNumber');
            const currentColor = String(color + 1);

            element.data('colorNumber', currentColor);
            element.style('label', element.data('colorNumber'));
            element.style('color', colors[color % colors.length]);
            element.style('border-color', colors[color % colors.length]);
            element.style('line-color', colors[color % colors.length]);
            element.style('text-border-color', colors[color % colors.length]);

            updateColor(element.data('id'), previousColor, currentColor);
        }, 1500 * counter);

        counter++;
    };

    if (orientation === 'color') {
        totalColoring.forEach((elementsLabels, color) => {
            elementsLabels.forEach((elementLabel) => {
                showColor(color, elementLabel);
            });
        });
    } else if (orientation === 'index') {
        const maxElementsLabels = totalColoring.reduce((prev, curr) => (
            prev.length > curr.length ? prev : curr
        ));

        const maxElementIndex = maxElementsLabels.length - 1;
        const maxColorIndex = totalColoring.length - 1;

        for (let elementIndex = 0; elementIndex <= maxElementIndex; elementIndex++) {
            for (let colorIndex = 0; colorIndex <= maxColorIndex; colorIndex++) {
                if (elementIndex < totalColoring[colorIndex].length) {
                    showColor(colorIndex, totalColoring[colorIndex][elementIndex]);
                }
            }
        }
    }
};

export { generateVisualization, assignColorNumber, showColoring }