import { describe, expect, it } from "vitest";

import type { TileTypeCodeMapping } from "@game/config/TileCodeMapper";

import TileCode from "@game/config/TileCode";
import TileCodeMapper from "@game/config/TileCodeMapper";

const testConfig: TileTypeCodeMapping = {
    start: "A",
    finish: "B",
    wall: "C",
    coin: "D",
    key: "E",
    door: "F",
    monster: "G"
};

describe("TileCodeMapper#constructor", {}, () => {
    it.each([
        [{}],
        [{wall: ""}],
        [{wall: undefined}],
        [{start:"",finish:"",wall:"",coin:"",key:"",door:"",monster:""}],
    ])("throws when a config contains invalid entries: %s",
        (malformedConfig: object) => {
            expect(() => new TileCodeMapper(malformedConfig as TileTypeCodeMapping)).toThrowError();
        });
});

describe("TileCodeMapper.fromConfig", {}, () => {
    it.each([
        [{}],
        [{wall: ""}],
        [{wall: undefined}],
        [{start:"",finish:"",wall:"",coin:"",key:"",door:"",monster:""}],
    ])("returns undfined when created from a malformed config: %s",
        (malformedConfig: object) => {
            expect(TileCodeMapper.fromConfig(malformedConfig as TileTypeCodeMapping)).toBeUndefined();
        });

    it("returns TileCodeMapper was created with a valid config", () => {
        expect(TileCodeMapper.fromConfig(testConfig)).toBeDefined();
    });
});

describe("TileCodeMapper.isWall", {}, () => {
    it.each([
        // Default config.
        [undefined, new TileCode("W", 0), true],
        [undefined, new TileCode("W"), true],
        [undefined, new TileCode("W", 1111), true],
        [undefined, new TileCode("A"), false],
        [undefined, new TileCode("B", 11), false],
        [undefined, new TileCode("C", 99), false],

        // Test config.
        [testConfig, new TileCode("W", 0), false],
        [testConfig, new TileCode("W"), false],
        [testConfig, new TileCode("W", 1111), false],
        [testConfig, new TileCode("A"), false],
        [testConfig, new TileCode("B", 11), false],
        [testConfig, new TileCode("D", 99), false],
        [testConfig, new TileCode("C", 1), true],
        [testConfig, new TileCode("C"), true],
        [testConfig, new TileCode("C", 73), true],
    ])("given %s and %s isWall returns %b",
        ( config: object | undefined, tile: TileCode, isWall: boolean) => {
            const tileCodeMapper = TileCodeMapper.fromConfig(config as TileTypeCodeMapping | undefined);

            expect(tileCodeMapper).toBeDefined();
            expect(tileCodeMapper!.isWall(tile)).toBe(isWall);
        });
});

