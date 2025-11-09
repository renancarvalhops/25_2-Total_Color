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