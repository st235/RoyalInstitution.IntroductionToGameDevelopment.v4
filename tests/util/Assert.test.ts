import { describe, expect, it } from "vitest";

import { assert } from "@/util/Assert";

describe("assert", {}, () => {
    it.each([
        [null],
        [undefined],
        [false],
        [4 < 2],
    ])("throws an exception if the condition (%s) failed", (condition) => {
        expect(() => { assert(condition); }).toThrowError();
    });

    it.each([
        [2 > 1],
        [true],
        [0 > -100],
    ])("does not throw anything", (condition) => {
        assert(condition);
    });
});
