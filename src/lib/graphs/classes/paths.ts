const getPathGraphMatrix = (order: number): number[][] => {
    const matrix = Array.from({ length: order }, () => Array(order).fill(0));

    for (let i = 0; i < order - 1; i++) {
        matrix[i][i + 1] = 1;
    }

    return matrix;
};

const getPathGraphTotalColoring = (order: number): string[][] => {
    const totalChromaticNumber = order > 1 ? 3 : 1;
    const coloring = Array.from({ length: totalChromaticNumber }, () => Array<string>());

    for (let i = 0; i < 2 * order - 1; i++) {
        if (i % 2 === 0) {
            coloring[i % 3].push(`${i / 2}`);
        } else {
            coloring[i % 3].push(`${(i - 1) / 2}_${(i + 1) / 2}`);
        }
    }

    return coloring;
};

export { getPathGraphMatrix, getPathGraphTotalColoring }