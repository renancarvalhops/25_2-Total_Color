import { validateTotalColoring } from "@/lib/graphs/coloring";
import { Graph } from "@/types";
import cytoscape, { Collection, Core, EventObject } from "cytoscape";
import { RefObject } from "react";

const generateVisualization = (graph: Graph, containerRef: RefObject<HTMLElement | null>): Core => {
    const cy = cytoscape({
        container: containerRef.current,
        elements: graph.elements,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#526D82',
                    'color': '#FFF',
                    'font-size': '16px',
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
                    'font-size': '16px',
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
            }
        ],
        layout: {
            name: 'circle'
        }
    });

    return cy;
};

const assignColorNumber = (event: EventObject): void => {
    const elements: Collection = event.target;
    let hasFirstKeypress = true;

    const keyboardEventHandler = (event: KeyboardEvent) => {
        if (RegExp(/\d/g).test(event.key)) {
            if (hasFirstKeypress) {
                hasFirstKeypress = false;
                elements.data('colorNumber', event.key);
            } else {
                elements.data('colorNumber', elements.data('colorNumber') + event.key);
            }

            elements.style('label', elements.data('colorNumber'));
        } else {
            elements.unselect();
        }
    };

    window.addEventListener('keypress', keyboardEventHandler);

    elements.on('unselect', () => {
        window.removeEventListener('keypress', keyboardEventHandler);
        showTotalColoringValidation(elements);
    });
};

const showTotalColoringValidation = (elements: Collection) => {
    elements.forEach(element => {
        const { hasConflict, adjacentElements } = validateTotalColoring(element);
        element.data('hasConflict', hasConflict);

        adjacentElements.forEach(adjacentElement => {
            const { hasConflict } = validateTotalColoring(adjacentElement);
            adjacentElement.data('hasConflict', hasConflict);
        });
    });
};

export { generateVisualization, assignColorNumber }