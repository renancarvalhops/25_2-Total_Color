import { EdgeDataDefinition, NodeDataDefinition } from "cytoscape";

export type GraphClassesNames = "completes" | "paths" | "cycles";
export type AcceptedFileExtensions = "txt" | "g6";
export type ColoringOrientation = "color" | "index";

export interface GraphView {
    coloring?: {
        show: boolean;
        orientation: ColoringOrientation;
    };
    layout: string;
    name: string;
    renderings: number;
}

export interface TCNodeDataDefinition extends NodeDataDefinition {
    id: string,
    hasConflict: boolean,
    elementColor: string
}

export interface TCEdgeDataDefinition extends EdgeDataDefinition {
    id: string,
    source: string,
    target: string,
    hasConflict: boolean,
    elementColor: string
}