import { GraphView, TCEdgeDataDefinition, TCNodeDataDefinition } from "@/types";
import cytoscape, { Collection, Core, ElementsDefinition, EventObject, SingularElementArgument } from "cytoscape";
import { ChangeEvent, RefObject } from "react";
import { convertToCyElementId, convertToElementId, HexadecimalColors } from "./ViewerUtils";
import GraphFree from "@/lib/graphs/FreeGraph";
import Graph from "@/lib/graphs/Graph";

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
    if (graph instanceof GraphFree) {
        const nodeData: TCNodeDataDefinition = {
            id: convertToCyElementId(`${graph.matrix.length}`),
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
    const cy = event.cy;
    const nodesSelected = cy.nodes(':selected');

    if (nodesSelected.length === 2 && graph instanceof GraphFree) {
        const sourceId = nodesSelected[0].id();
        const targetId = nodesSelected[1].id();
        const edgeId = `${sourceId}${targetId}`;

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

            graph.addEdge(Number(convertToElementId(sourceId)), Number(convertToElementId(targetId)));
        }

        nodesSelected.unselect();
    }
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
        },
        selectionType: "additive",
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

const assignElementColor = (event: EventObject, updateDisplayedColoring: (cyElementId: string, color: string) => void) => {
    const element: SingularElementArgument = event.target;

    const inputID = "assign_aux";
    const input = document.getElementById(inputID);
    if (!input) {
        const newInput = document.createElement("input");
        newInput.id = inputID;
        newInput.type = "number";
        newInput.style.position = "absolute";
        newInput.style.top = "-100px";
        newInput.style.opacity = "0";
        newInput.addEventListener("input", () => {
            event.cy.$(":selected").forEach((el) => {
                el.data("elementColor", newInput.value);
                el.style('label', element.data('elementColor'));
            });
        });
        newInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                event.cy.$(":selected").unselect();
            }
        });
        document.body.appendChild(newInput);
        newInput.focus();
        newInput.click();
    } else {
        input.focus();
        input.click();
    }

    element.off('unselect');

    element.on('unselect', () => {
        const currentColor = element.data('elementColor');
        const elementId = element.data('id');

        element.classes('');

        if (currentColor) {
            element.addClass(HexadecimalColors.getWithoutHash(Number(currentColor) - 1));
        }

        updateDisplayedColoring(elementId, currentColor);

        const input = document.getElementById(inputID);
        if (input) {
            input.remove();
        }

        showColoringValidation(element);
    });
};

const showColoring = (cy: Core, graph: Graph, updateDisplayedColoring: (cyElementId: string, color: string) => void) => {
    if (!graph.totalColoring) return;

    const coloring = Array.from(graph.totalColoring);

    let index = 0;

    const intervalId = setInterval(() => {
        if (index >= coloring.length) {
            clearInterval(intervalId);
            return;
        }

        const [elementId, color] = coloring[index];
        const icolor = Number(color);
        const cyElement = cy.$id(convertToCyElementId(elementId));

        cyElement.data('elementColor', String(icolor + 1));
        cyElement.style('label', cyElement.data('elementColor'));
        cyElement.classes('');
        cyElement.addClass(HexadecimalColors.getWithoutHash(icolor));

        updateDisplayedColoring(cyElement.data('id'), String(icolor + 1));

        index++;
    }, 1000);

    return intervalId;
};

export { generateVisualization, assignElementColor, showColoring, createVertex, createEdge }