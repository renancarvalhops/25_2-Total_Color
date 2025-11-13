import { GraphClass } from "./GraphClass";

export default class CycleGraph extends GraphClass {
    constructor(order: number) {
        super(order);
    }

    getMatrix(order: number): number[][] {
        const matrix = Array.from({ length: order }, () => Array(order).fill(0));

        for (let i = 0; i < order - 1; i++) {
            matrix[i][i + 1] = 1;
        }

        matrix[0][order - 1] = 1;

        return matrix;
    }

    getTotalColoring(order: number): string[][] {
        const R = order % 3;
        const totalChromaticNumber = R === 0 ? 3 : 4;
        const coloring = Array.from({ length: totalChromaticNumber }, () => Array<string>());

        if (R % 2 === 0) {
            let i = 0;
            for (; i < 2 * order - 1; i++) {
                if (i % 2 === 0) {
                    coloring[i % 3].push(`${i / 2}`);
                } else {
                    coloring[i % 3].push(`${(i - 1) / 2}_${(i + 1) / 2}`);
                }
            }

            coloring[R === 0 ? (i % 3) : 3].push(`0_${(i - 1) / 2}`);            
        } else {
            let i = 0;
            for (; i < 2 * order - 1; i++) {
                if (i % 2 === 0) {
                    coloring[i % 4].push(`${i / 2}`);
                } else {
                    coloring[i % 4].push(`${(i - 1) / 2}_${(i + 1) / 2}`);
                }
            }
    
            coloring[i % 4].push(`0_${(i - 1) / 2}`);
        }


        return coloring;
    }
}