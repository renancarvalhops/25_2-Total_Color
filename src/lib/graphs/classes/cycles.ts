const getCycleGraphMatrix = (order: number): number[][] => {
    const matrix = Array.from({ length: order }, () => Array(order).fill(0));

    for (let i = 0; i < order - 1; i++) {
        matrix[i][i + 1] = 1;
    }

    matrix[0][order - 1] = 1;

    return matrix;
};

// const getCycleGraphTotalColoring = (order: number): string[][] => {
//     const totalChromaticNumber = order > 1 ? 3 : 1;
//     const coloring = Array.from({ length: totalChromaticNumber }, () => Array<string>());
//     let lastEdgeColor: number | undefined;

//     for (let i = 0; i < order - 1; i++) {
//         switch (i % 3) {
//             case 0:
//                 coloring[0].push(`${i}`);
//                 coloring[1].push(`${i}${i + 1}`);
//                 lastEdgeColor = 1;
//                 break;
//             case 1:
//                 coloring[2].push(`${i}`);
//                 coloring[0].push(`${i}${i + 1}`);
//                 lastEdgeColor = 0;
//                 break;
//             case 2:
//                 coloring[1].push(`${i}`);
//                 coloring[2].push(`${i}${i + 1}`);
//                 lastEdgeColor = 2;
//                 break;
//         }
//     }

//     const lastVertexColor = typeof lastEdgeColor === 'undefined' ? 0 : (lastEdgeColor + 1) % 3;
//     coloring[lastVertexColor].push(`${order - 1}`);

//     return coloring;
// };

export { getCycleGraphMatrix }