const getCompleteGraphMatrix = (order: number): number[][] => {
    const matrix = Array.from({ length: order }, () => Array(order).fill(0));

    for (let i = 0; i < order; i++) {
        for (let j = i + 1; j < order; j++) {
            matrix[i][j] = 1;
        }
    }
    
    return matrix;
};

export { getCompleteGraphMatrix }