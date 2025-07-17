/**
 * Wraps the array with the provided item.
 * 
 * @param items origin 2 dimensions array.
 * @param defaultItem an item to wrap the array.
 * @param size the amount of items occupied by array.
 * @returns modified array.
 */
function pad2D<T = unknown>(items: T[][], defaultItem: T, size: number = 1): T[][] {
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
                out[i].push(defaultItem);
            }
        }
    }

    return out;
}

function clamp2D<T = unknown>(items: T[][], defaultItem: T, dimensions: [number, number]) {
    if (dimensions[0] <= 0 || dimensions[1] < 0) {
        return [];
    }

    const out: T[][] = new Array<T[]>(dimensions[0]);

    for (let i = 0; i < dimensions[0]; i++) {
        out[i] = new Array<T>(dimensions[1]);
        for (let j = 0; j < dimensions[1]; j++) {
            if (i < items.length && j < items[i].length) {
                out[i][j] = items[i][j];
            } else {
                out[i][j] = defaultItem;
            }
        }
    }

    return out;
}

export { clamp2D, pad2D };
