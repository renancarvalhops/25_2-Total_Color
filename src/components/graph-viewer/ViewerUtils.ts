import { mod } from "@/lib/utils";

class HexadecimalColors {
    private static hexColors = [
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

    public static get(color: number) {
        return this.hexColors[mod(color, this.hexColors.length)];
    }
}

const convertToElementId = (elementLabel: string): string => {
    const labelParts = elementLabel.split('_');

    const elementId = labelParts.length === 2 ?
        `v${Number(labelParts[0]) + 1}v${Number(labelParts[1]) + 1}` :
        `v${Number(labelParts[0]) + 1}`;

    return elementId;
};

export { HexadecimalColors, convertToElementId }