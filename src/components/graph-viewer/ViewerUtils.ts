import CompleteGraph from "@/lib/graphs/classes/CompleteGraph";
import CycleGraph from "@/lib/graphs/classes/CycleGraph";
import { GraphClass } from "@/lib/graphs/classes/GraphClass";
import PathGraph from "@/lib/graphs/classes/PathGraph";
import { Color, Coloring, GraphElement } from "@/lib/graphs/types";
import { mod } from "@/lib/utils";
import { GraphClassName } from "@/types";

class HexadecimalColors {
    private static hexColors = [
        "#3CB44B", "#FFE119", "#4363D8", "#F58231", "#911EB4",
        "#46F0F0", "#F032E6", "#BCF60C", "#FABEBE", "#008080",
        "#E6BEFF", "#9A6324", "#FFD8B1", "#800000", "#AAFFC3",
        "#808000", "#FF7F00", "#E6194B", "#000075", "#FF1493",
        "#00CED1", "#9400D3", "#32CD32", "#FF4500", "#1E90FF",
        "#FFD700", "#4B0082", "#00FA9A", "#DC143C", "#00BFFF",
        "#ADFF2F", "#FF69B4", "#8B4513", "#40E0D0", "#9932CC",
        "#FF6347", "#7FFF00", "#6495ED", "#D2691E", "#20B2AA",
        "#FF8C00", "#6A5ACD", "#9ACD32", "#BA55D3", "#00FF7F",
        "#CD5C5C", "#4682B4", "#B8860B", "#00CED1", "#000000"
    ];

    public static get(color: number) {
        return this.hexColors[mod(color, this.hexColors.length)];
    }

    public static getWithoutHash(color: number) {
        return this.hexColors[mod(color, this.hexColors.length)].replace('#', '');
    }

    public static getAll() {
        return this.hexColors;
    }

    public static getAllWithoutHash() {
        return this.hexColors.map((hexColor) => hexColor.replace('#', ''));
    }
}

const convertToCyElementId = (element: GraphElement): string => {
    const parts = element.split(" ");

    const cyElementId = parts.length === 2 ?
        `v${Number(parts[0]) + 1}v${Number(parts[1]) + 1}` :
        `v${Number(parts[0]) + 1}`;

    return cyElementId;
};

const convertToElementId = (cyElementId: string): GraphElement => {
    const parts = cyElementId.replace("v", "").split("v");

    const elementId: GraphElement = parts.length === 2 ?
        `${Number(parts[0]) - 1} ${Number(parts[1]) - 1}` :
        `${Number(parts[0]) - 1}`;

    return elementId;
}

const getColoringByColor = (coloring: Coloring): Map<Color, GraphElement[]> => {
    const coloringByColor: Map<Color, GraphElement[]> = new Map();

    coloring.entries().forEach(([element, color]) => {
        const colorElements = coloringByColor.get(color);
        let newColorElements: GraphElement[] = [];

        if (colorElements) {
            newColorElements = [...colorElements];
        }
        
        newColorElements.push(element);
        coloringByColor.set(color, newColorElements);
    });

    return coloringByColor;
}

const getGraphClassName = (graph: GraphClass): GraphClassName | "" => {
    if (graph instanceof PathGraph)
        return "paths";
    else if (graph instanceof CycleGraph)
        return "cycles";
    else if (graph instanceof CompleteGraph)
        return "completes";
    else
        return "";
}

export { HexadecimalColors, convertToCyElementId, convertToElementId, getColoringByColor, getGraphClassName }