import { mod } from "@/lib/utils";

const getCompleteGraphMatrix = (order: number): number[][] => {
    const matrix = Array.from({ length: order }, () => Array(order).fill(0));

    for (let i = 0; i < order; i++) {
        for (let j = i + 1; j < order; j++) {
            matrix[i][j] = 1;
        }
    }
    
    return matrix;
};

const getCompleteGraphTotalColoring = (order: number): string[][] => { 
    const isOdd = order % 2 === 1;
    const totalChromaticNumber = order + (isOdd ? 0 : 1);
    const coloring = Array.from({ length: totalChromaticNumber }, () => Array<string>());

    if (isOdd) {
        for (let i = 0; i < totalChromaticNumber; i++) {
            coloring[i].push(`${i}`);

            for (let j = 1; j <= (order - 1) / 2; j++) {
                const leftIndex = mod(i - j, order);
                const rightIndex = mod(i + j, order);

                coloring[i].push(`${Math.min(leftIndex, rightIndex)}${Math.max(leftIndex, rightIndex)}`);
            }
        }
    } else {
        for (let i = 0; i < totalChromaticNumber; i++) {
            if (i != 0) {
                coloring[i].push(`${i - 1}`);
            }

            for (let j = 1; j <= order / 2; j++) {
                const leftIndex = mod(i - j, order + 1);
                const rightIndex = mod(i + j, order + 1);

                if (leftIndex !== 0 && rightIndex !== 0) {
                    coloring[i].push(`${Math.min(leftIndex, rightIndex) - 1}${Math.max(leftIndex, rightIndex) - 1}`);
                }

            }
        }
    }

    return coloring;
};

export { getCompleteGraphMatrix, getCompleteGraphTotalColoring }