import { mod } from "@/lib/utils";

class HexadecimalColors {
    private static hexColors = [
        '#3867d6',
        '#fa8231',
        '#20bf6b',
        '#8854d0',
        '#f7b731',
        '#a5b1c2',
        '#4c3a2c',
        '#000000'   
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

const convertToElementId = (elementLabel: string | number): string => {
    const labelParts = String(elementLabel).split('_');

    const elementId = labelParts.length === 2 ?
        `v${Number(labelParts[0]) + 1}v${Number(labelParts[1]) + 1}` :
        `v${Number(labelParts[0]) + 1}`;

    return elementId;
};

const convertToElementLabel = (elementId: string): number => {
    return Number.parseInt(elementId.replace('v', '')) - 1;
}

export { HexadecimalColors, convertToElementId, convertToElementLabel }