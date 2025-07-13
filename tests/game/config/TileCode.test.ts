import { describe, expect, it } from "vitest";

import TileCode from "@/game/config/TileCode";

describe("TileCode#constructor", {}, () => {
    it.each([
        ["", 1],
        ["AB", 1.2],
        ["CD", -15],
        ["ABC", Number.NaN],
        ["ABC", Number.POSITIVE_INFINITY],
        ["ABC", Number.NEGATIVE_INFINITY],
    ])("throws when a type code (%s) and variation (%d) used for construction are invaliud or not allowed",
        (typeCode: string, variation: number) => {
            expect(() => new TileCode(typeCode, variation)).toThrowError();
        });

    it.each([
        [new TileCode("c", 0), "C"],
        [new TileCode("aB", 1), "AB"],
        [new TileCode("Cd", 99), "CD"],
        [new TileCode("AbC", 105), "ABC"],
    ])("typeCode is converted to upper case upon construction", (tileCode, expectedTileCode) => {
        expect(tileCode.typeCode).toBe(expectedTileCode);
    });
});

describe("TileCode#hasVariation", {}, () => {
    it.each([
        [new TileCode("C", 0)],
        [new TileCode("AB", 1)],
        [new TileCode("CD", 99)],
        [new TileCode("ABC", 105)],
    ])("returns true when TileCode (%s) was created with a variation", (tileCode) => {
        expect(tileCode.hasVariation()).toBe(true);
    });

    it.each([
        [new TileCode("C")],
        [new TileCode("AB", undefined)],
    ])("returns false when TileCode (%s) was created without a variation", (tileCode) => {
        expect(tileCode.hasVariation()).toBe(false);
    });
});

describe("TileCode#toString", {}, () => {
    it.each([
        [new TileCode("C", 0), "C0"],
        [new TileCode("AB", 1), "AB1"],
        [new TileCode("CD", 99), "CD99"],
        [new TileCode("ABC", 105), "ABC105"],
    ])("returns true when TileCode (%s) was created with a variation", (tileCode, tileCodeString) => {
        expect(`${tileCode}`).toBe(tileCodeString);
    });
});


describe("TileCode.fromRaw", {}, () => {
    it.each([
        [""],
        ["hello world"],
        ["abc-99"],
        ["abc0.999"],
        ["111abc"],
        ["AB BC"],
        ["W 0"],
        ["0"],
        ["A01"],
        ["ABC01"],
        ["A_1"],
    ])("returns undefined when cannot correctly parse raw tile code: %s", (rawTileCode) => {
        expect(TileCode.fromRaw(rawTileCode)).toBeUndefined();
    });

    it.each([
        ["A0", new TileCode("A", 0)],
        ["B1", new TileCode("B", 1)],
        ["c2", new TileCode("C", 2)],
        ["D1", new TileCode("D", 1)],
        ["CC99", new TileCode("CC", 99)],
        ["DA743", new TileCode("DA", 743)],
        ["Hello235", new TileCode("HELLO", 235)],
    ])("returns correct TileCode when correct raw tile code passed: %s", (rawTileCode, expectedTileCode) => {
        expect(TileCode.fromRaw(rawTileCode)).toStrictEqual(expectedTileCode);
    });
});

