
import { describe, expect, it } from "vitest";

import { clamp2D, pad2D } from "@/util/Arrays";

const ARRAY_0: number[][] = [];

const PADDED_ARRAY_0 = [
    [5, 5, 5, 5],
    [5, 5, 5, 5],
    [5, 5, 5, 5],
    [5, 5, 5, 5],
];

const CLAMPED_ARRAY_0 = [
    [1, 1, 1],
    [1, 1, 1],
];

const ARRAY_1 = [
    [0]
];

const PADDED_ARRAY_1 = [
    [-1, -1, -1],
    [-1, 0, -1],
    [-1, -1, -1],
];

const CLAMPED_ARRAY_1 = [
    [0, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
];

const ARRAY_2 = [
    [1, 2, 3],
    [4, 5, 6],
];

const PADDED_ARRAY_2 = [
    [-1, -1, -1, -1, -1],
    [-1,  1,  2,  3, -1],
    [-1,  4,  5,  6, -1],
    [-1, -1, -1, -1, -1],
];

const CLAMPED_ARRAY_2 = [
    [ 1,  2,  3, -1, -1],
    [ 4,  5,  6, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
];

const ARRAY_3 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [0, 1, 2],
];

const PADDED_ARRAY_3 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0, 0],
    [0, 0, 0, 4, 5, 6, 0, 0, 0],
    [0, 0, 0, 7, 8, 9, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const CLAMPED_ARRAY_3 = [
    [1, 2, 3, 0, 0, 0, 0, 0, 0],
    [4, 5, 6, 0, 0, 0, 0, 0, 0],
    [7, 8, 9, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

describe("pad2D", {}, () => {
    it.each([
        [ARRAY_0, 5, 2, PADDED_ARRAY_0],
        [ARRAY_1, -1, 1, PADDED_ARRAY_1],
        [ARRAY_2, -1, 1, PADDED_ARRAY_2],
        [ARRAY_3, 0, 3, PADDED_ARRAY_3],
    ])("pad2D pads the array with the right numbers",
        (array: number[][], defaultElement: number, size: number, expectedArray: number[][]) => {
            expect(pad2D(array, defaultElement, size)).toStrictEqual(expectedArray);
        });
});

describe("clamp2D", {}, () => {
    it.each([
        [ARRAY_0, 1, [2, 3], CLAMPED_ARRAY_0],
        [ARRAY_1, -1, [3, 3], CLAMPED_ARRAY_1],
        [ARRAY_2, -1, [4, 5], CLAMPED_ARRAY_2],
        [ARRAY_3, 0, [10, 9], CLAMPED_ARRAY_3],
    ])("clamp2D creates the right array",
        (array: number[][], defaultElement: number, dimensions: number[], expectedArray: number[][]) => {
            expect(clamp2D(array, defaultElement, dimensions as [number, number])).toStrictEqual(expectedArray);
        });
});

