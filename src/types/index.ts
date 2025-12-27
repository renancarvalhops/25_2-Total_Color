import { Coloring } from "@/lib/graphs/types";
import { EdgeDataDefinition, NodeDataDefinition } from "cytoscape";

export type GraphMode = "classes" | "free";
export type ActionMode = "view" | "coloring" | "vertex" | "edge";
export type GraphClassName = "completes" | "paths" | "cycles";
export type AcceptedFile = "txt" | "g6";

export interface GraphView {
    showColoring?: boolean;
    displayedColoring: Coloring;
    layout: string;
    name: string;
    active: boolean;
    actionMode: ActionMode;
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