function pad2D<T = unknown>(items: T[][], withItem: T, size: number = 1): T[][] {
    const height = items.length;
    const width = items.length > 0 ? items[0].length : 0;

    const newHeight = height + 2 * size;
    const newWidth = width + 2 * size;

    const out: T[][] = [];

    for (let i = 0; i < newHeight; i++) {
        out.push([]);

        for (let j = 0; j < newWidth; j++) {
            if (i >= size && i < newHeight - size &&
                j >= size && j < newWidth - size) {
                out[i].push(items[i - size][j - size]);
            } else {
                out[i].push(withItem);
            }
        }
    }

    return out;
}

export { pad2D };
