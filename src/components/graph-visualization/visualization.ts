import { validateTotalColoring } from "@/lib/graphs";
import { Graph } from "@/types";
import cytoscape, { Core, ElementsDefinition, EventObject, SingularElementArgument } from "cytoscape";
import { RefObject } from "react";

const generateVisualization = (graph: Graph, containerRef: RefObject<HTMLElement | null>): Core | null => {
    if (graph.matrix) {
        const cy = cytoscape({
            container: containerRef.current,
            elements: generateElements(graph.matrix),
            style: [
                {
                    selector: '*',
                    style: {
                        'transition-duration': 1
                    }
                },
                {
                    selector: 'node',
                    style: {
                        'background-color': '#526D82',
                        'color': '#FFF',
                        'font-size': '22px',
                        'font-weight': 'lighter',
                        'height': '50px',
                        'label': 'data(id)',
                        'text-valign': 'center',
                        'width': '50px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'color': '#FFF',
                        'font-size': '22px',
                        'line-color': '#526D82',
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
                name: graph.layout || 'null'
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
    const elementId = elementLabel.length > 1 ?
        `v${Number(elementLabel[0]) + 1}v${Number(elementLabel[1]) + 1}` :
        `v${Number(elementLabel) + 1}`;
    
    return elementId;
}

const colors = [
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
    let counter = 1;

    if (orientation === 'color') {
        totalColoring?.forEach((elementsLabels, color) => {
            elementsLabels.forEach((elementLabel) => {
                setTimeout(() => {
                    const element = cy.$id(convertToElementId(elementLabel));
                    const colorNumber = String(color + 1);
    
                    element.data('colorNumber', colorNumber);
                    element.style('label', element.data('colorNumber'));
                    element.style('background-color', colors[color % colors.length]);
                    element.style('line-color', colors[color % colors.length]);
                    //element.addClass('highlated');
    
                    // setTimeout(() => {
                    //     element.removeClass('highlated');
                    // }, 1000);
    
                    updateColor(element.data('id'), '', colorNumber);
                }, 1500 * counter);
    
                counter++;
            });
        });
    } else {
        const maxElementsLabels = totalColoring.reduce((prev, curr) => (
            prev.length > curr.length ? prev : curr
        ));

        const maxElementIndex = maxElementsLabels.length - 1;
        const maxColorIndex = totalColoring.length - 1;

        for (let elementIndex = 0; elementIndex <= maxElementIndex; elementIndex++) {
            for (let colorIndex = 0; colorIndex <= maxColorIndex; colorIndex++) {
                if (elementIndex < totalColoring[colorIndex].length) {
                    setTimeout(() => {
                        const element = cy.$id(convertToElementId(totalColoring[colorIndex][elementIndex]));
                        const colorNumber = String(colorIndex + 1);
        
                        element.data('colorNumber', colorNumber);
                        element.style('label', element.data('colorNumber'));
                        element.style('background-color', colors[colorIndex % colors.length]);
                        element.style('line-color', colors[colorIndex % colors.length]);
                        // element.addClass('highlated');
        
                        // setTimeout(() => {
                        //     element.removeClass('highlated');
                        // }, 1000);
        
                        updateColor(element.data('id'), '', colorNumber);
                    }, 1500 * counter);
        
                    counter++;
                }
            }
        }
    }
}

export { generateVisualization, assignColorNumber, showColoring }