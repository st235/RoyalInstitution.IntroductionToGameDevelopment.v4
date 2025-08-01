import { describe, expect, it } from "vitest";

import { isObject, deepMerge, flatten } from "@/util/Objects";

describe("isObject", {}, () => {
    it.each([
        // Not objects.
        [null, false],
        [undefined, false],
        [1, false],
        [NaN, false],
        [Infinity, false],
        [-Infinity, false],
        [0, false],
        [-99, false],
        [3.14, false],
        [1e3, false],
        [2e-4, false],
        [true, false],
        [false, false],
        ["", false],
        ["Hello world", false],
        [[], false],
        [[1, false, "b"], false],
        [[0, 3, -9e-5], false],

        // Objects.
        [{}, true],
        [{a: 2}, true],
        [{a: {b: [true, 5]}}, true],
        [{a: [0, 1], c: -99, d: {e: ""}}, true],
        [{t: ["hello", false]}, true],
    ])("returns correctly whether an entity is an object", (entity: unknown, expectedIsObject: boolean) => {
        expect(isObject(entity)).toStrictEqual(expectedIsObject);
    });
});

describe("flatten", {}, () => {
    it.each([
        // Flat objects.
        [{}, {}],
        [{a: 5}, {a: 5}],
        [{a: 5, b: "Hello"}, {a: 5, b: "Hello"}],
        [{a: -1, b: "Hello", c: [1, false, 3]}, {a: -1, b: "Hello", c: [1, false, 3]}],

        // Complex objects.
        [{a:{b: 5}}, {b: 5}],
        [{a:{b: 5, c: [0, false, "e"]},}, {b: 5, c: [0, false, "e"]}],
        [{a:{b: 5, c: [0, false, "e"], d: {g: "world"}},}, {b: 5, c: [0, false, "e"], g: "world"}],
        [{d:{a:{b:{a:{w: "inner"}}}}, e: {b: ["hello"]}}, {w: "inner", b: ["hello"]}],
    ])("returns flattened object",
        (obj: {[Key: string]: unknown}, expectedFlattenedObj: {[Key: string]: unknown}) => {
            expect(flatten(obj)).toStrictEqual(expectedFlattenedObj);
        });
});

describe("deepMerge", {}, () => {
    it.each([
        // Edge cases.
        [{}, [], {}],
        [{a: 2}, [], {a: 2}],
        [{a: 2}, [true, 5, false], {a: 2}],
        [{a: 2}, [{}, [true], -2.2], {a: 2}],

        // Common cases.
        [{a: 5}, [{a: 6}], {a: 6}],
        [{a: 5}, [{a: 6}, {c: {d: "world"}}], {a: 6, c: {d: "world"}}],
        [{a: 5}, [{a: 6}, {c: {d: "world"}}, {c: {e: "hello"}}], {a: 6, c: {d: "world", e: "hello"}}],
        [{a: 5, c: {g: "initial"}}, [{a: 6}, {c: {d: "world"}}, {c: {e: "hello"}}], {a: 6, c: {d: "world", e: "hello", g: "initial"}}],
        [{b: "hello"}, [{b: {a: [0, 1]}}, {b: {a: "hello", d: {a: [0,1]}}}, {b: {d: {e: false}}}], {b: {a: "hello", d: {a: [0,1], e: false}}}],
    ])("returns flattened object",
        (targetObject: {[Key: string]: unknown}, sourceObjects: unknown[], expectedObject: {[Key: string]: unknown}) => {
            expect(deepMerge(targetObject, ...sourceObjects)).toStrictEqual(expectedObject);
        });
});
