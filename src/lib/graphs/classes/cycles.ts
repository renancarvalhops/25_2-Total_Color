const getCycleGraphMatrix = (order: number): number[][] => {
    const matrix = Array.from({ length: order }, () => Array(order).fill(0));

    for (let i = 0; i < order - 1; i++) {
        matrix[i][i + 1] = 1;
    }

    matrix[0][order - 1] = 1;

    return matrix;
};

const getCycleGraphTotalColoring = (order: number): string[][] => {
    const totalChromaticNumber = order % 3 === 0 ? 3 : 4;
    const coloring = Array.from({ length: totalChromaticNumber }, () => Array<string>());

    let i = 0;
    for (; i < 2 * order - 1; i++) {
        if (i % 2 === 0) {
            coloring[i % totalChromaticNumber].push(`${i / 2}`);
        } else {
            coloring[i % totalChromaticNumber].push(`${(i - 1) / 2}${(i + 1) / 2}`);
        }
    }

    coloring[i % totalChromaticNumber].push(`0${(i - 1) / 2}`);

    return coloring;
};

export { getCycleGraphMatrix, getCycleGraphTotalColoring }