
import { describe, expect, it } from "vitest";

import TileVariationReader from "@game/config/TileVariationReader";

describe("TileVariationReader#constructor", {}, () => {
    it("throws when receive an empty array", () => {
        expect(() => new TileVariationReader([])).toThrowError();
    });

    it("throws when a default variation is float", () => {
        expect(() => new TileVariationReader([1, 2], 9.1)).toThrowError();
    });

    it("throws when a default variation is negative", () => {
        expect(() => new TileVariationReader([1, 2], -91)).toThrowError();
    });

    it("throws when a default variation is outside of array bounds", () => {
        expect(() => new TileVariationReader([1, 2], 2)).toThrowError();
    });

    it("throws when an unknown variation is float", () => {
        expect(() => new TileVariationReader([1, 2], 0, 0.22)).toThrowError();
    });

    it("throws when an unknown variation is negative", () => {
        expect(() => new TileVariationReader([1, 2], 0, -91)).toThrowError();
    });

    it("throws when an unknown variation is outside of array bounds", () => {
        expect(() => new TileVariationReader([1, 2], 0, 2)).toThrowError();
    });
});

describe("TileVariationReader#getDefaultTile", {}, () => {
    it("returns the first tile id when default variation is not specified", () => {
        const reader = new TileVariationReader([1, 2, 3]);
        expect(reader.getDefaultTile()).toBe(1);
    });

    it("returns the specified tile id when default variation is provided", () => {
        const reader = new TileVariationReader([1, 2, 3], 2);
        expect(reader.getDefaultTile()).toBe(3);
    });
});

describe("TileVariationReader#getTileFor", {}, () => {
    it.each([
        [[1, 2, 3], 0, 1],
        [[5], 0, 5],
        [[7, 4, 3], 2, 3],
        [[7, 4, -1, -1, 55], 3, -1],
    ])("returns the default tile id when a variation is not provided", 
        (variations: number[], defaultVariation: number, expectedTileId: number) => {
            const reader = new TileVariationReader(variations, defaultVariation);
            expect(reader.getTileFor()).toBe(expectedTileId);
        });

    it.each([
        [[1, 2, 3], 0, 1],
        [[5], 0, 5],
        [[7, 4, 3], 2, 3],
        [[7, 4, -1, -1, 55], 3, -1],
    ])("returns the specified tile id when a variation is provided and valid", 
        (variations: number[], variation: number, expectedTileId: number) => {
            const reader = new TileVariationReader(variations);
            expect(reader.getTileFor(variation)).toBe(expectedTileId);
        });

    it.each([
        [[1, 2, 3], -1, 1, 2],
        [[1, 2, 7, -1], 99, 3, -1],
    ])("returns the default tile id when a variation is invalid and unknown variation is not specified", 
        (variations: number[], variation: number, defaultVariation: number, expectedTileId: number) => {
            const reader = new TileVariationReader(variations, defaultVariation);
            expect(reader.getTileFor(variation)).toBe(expectedTileId);
        });

    it.each([
        [[1, 2, 3], -1, 1, 2],
        [[1, 2, 7, -1], 99, 3, -1],
    ])("returns the unknown tile id when a variation is invalid and unknown variation specified", 
        (variations: number[], variation: number, unknownVariation: number, expectedTileId: number) => {
            const reader = new TileVariationReader(variations, undefined, unknownVariation);
            expect(reader.getTileFor(variation)).toBe(expectedTileId);
        });
});
