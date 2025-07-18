import Phaser from "phaser";

import type { CharacterConfig } from "@game/config/CharacterConfigReader";
import type { CoinsConfig } from "@game/config/CoinsConfigReader";
import type { DoorsConfig } from "@game/config/DoorsConfigReader";
import type { GarnitureConfig } from "@game/config/GarnitureConfigReader";
import type { MonstersConfig } from "@game/config/MonstersConfigReader";
import type { RawLayout } from "@game/config/LayoutConfigReader";
import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import { assert } from "@/util/Assert";
import { clamp2D, pad2D } from "@/util/Arrays";
import CharacterConfigReader from "@game/config/CharacterConfigReader";
import CoinsConfigReader from "@game/config/CoinsConfigReader";
import DoorsConfigReader from "@game/config/DoorsConfigReader";
import FlagConfigReader from "@game/config/FlagConfigReader";
import GarnitureConfigReader from "@game/config/GarnitureConfigReader";
import LayoutConfigReader, { KEY_START_POINT, KEY_FINISH_POINT, KEY_COIN, KEY_KEY, KEY_DOOR, KEY_MONSTER } from "@game/config/LayoutConfigReader";
import MonstersConfigReader from "@game/config/MonstersConfigReader";
import WallConfigReader from "@game/config/WallConfigReader";

/**
 * A tile index for unnocupied cells.
 */
const _TILE_UNNOCUPIED = -1;

/**
 * Tuple represeting i, j position of a tile on a grid,
 * plus an optional variation.
 */
type PointWithVariation = [number, number, number | undefined];

class MazeInitialState {

    private readonly _outerWallsPadding: number = 1;

    private readonly _availableSize: [number, number];

    private readonly _layoutConfigReader: LayoutConfigReader;
    private readonly _characterConfigReader: CharacterConfigReader;
    private readonly _coinsConfigReader: CoinsConfigReader;
    private readonly _doorsConfigReader: DoorsConfigReader;
    private readonly _flagConfigReader: FlagConfigReader;
    private readonly _garnitureConfigReader: GarnitureConfigReader;
    private readonly _monstersConfigReader: MonstersConfigReader;
    private readonly _wallConfigReader: WallConfigReader;

    private _startPositions: PointWithVariation[];
    private _finishPositions: PointWithVariation[];
    private _coinsPositions: PointWithVariation[];
    private _keysPositions: PointWithVariation[];
    private _doorsPositions: PointWithVariation[];
    private _monstersPositions: PointWithVariation[];

    constructor(availableSize: [number, number],
        layoutConfigReader: LayoutConfigReader,
        characterConfigReader: CharacterConfigReader,
        coinsConfigReader: CoinsConfigReader,
        doorsConfigReader: DoorsConfigReader,
        flagConfigReader: FlagConfigReader,
        garnitureConfigReader: GarnitureConfigReader,
        monstersConfigReader: MonstersConfigReader,
        wallConfigReader: WallConfigReader) {
        this._availableSize = [Math.floor(availableSize[0]), Math.floor(availableSize[1])];
        assert(this._availableSize[0] > 0 && this._availableSize[1] > 0);

        this._layoutConfigReader = layoutConfigReader;
        this._characterConfigReader = characterConfigReader;
        this._coinsConfigReader = coinsConfigReader;
        this._doorsConfigReader = doorsConfigReader;
        this._flagConfigReader = flagConfigReader;
        this._garnitureConfigReader = garnitureConfigReader;
        this._monstersConfigReader = monstersConfigReader;
        this._wallConfigReader = wallConfigReader;

        const groupedDynamicObjects = this._layoutConfigReader.groupDynamicObjects();
        this._startPositions = this._padAll(groupedDynamicObjects[KEY_START_POINT] ?? []);
        this._finishPositions = this._padAll(groupedDynamicObjects[KEY_FINISH_POINT] ?? []);
        this._coinsPositions = this._padAll(groupedDynamicObjects[KEY_COIN] ?? []);
        this._keysPositions = this._padAll(groupedDynamicObjects[KEY_KEY] ?? []);
        this._doorsPositions = this._padAll(groupedDynamicObjects[KEY_DOOR] ?? []);
        this._monstersPositions = this._padAll(groupedDynamicObjects[KEY_MONSTER] ?? []);
    }

    getCharacterTile(): number {
        return this._characterConfigReader.getTile();
    }

    getFlagTile(variation?: number): number {
        return this._flagConfigReader.getTileFor(variation);
    }

    getCoinTile(variation?: number): number {
        return this._coinsConfigReader.getTileFor(variation);
    }

    getKeyTile(variation?: number): number {
        return this._doorsConfigReader.getTileForKey(variation);
    }

    getClosedDoorTile(variation?: number): number {
        return this._doorsConfigReader.getTileForClosedDoor(variation);
    }

    getOpenDoorTile(variation?: number): number {
        return this._doorsConfigReader.getTileForOpenDoor(variation);
    }

    getMonsterTile(variation: number): number {
        return this._monstersConfigReader.getTileFor(variation);
    }

    getGarnitureTile(variation: number): number {
        return this._garnitureConfigReader.getTileFor(variation);
    }

    getStartPoint(): PointWithVariation {
        return Phaser.Math.RND.pick(this._startPositions);
    }

    getFinishPoint(): PointWithVariation {
        return Phaser.Math.RND.pick(this._finishPositions);
    }

    getCoins(): PointWithVariation[] {
        return this._coinsPositions;
    }

    getKeys(): PointWithVariation[] {
        return this._keysPositions;
    }

    getMonsters(): PointWithVariation[] {
        return this._monstersPositions;
    }

    getCoinScore(variation?: number): number {
        return this._coinsConfigReader.getScoreFor(variation);
    }

    openDoors(variation?: number): PointWithVariation[] {
        if (variation === undefined) {
            return [];
        }

        const out: PointWithVariation[] = [];
        for (const door of this._doorsPositions) {
            if (door[2] === variation) {
                out.push(door);
            }
        }

        return out;
    }

    getMonsterUpdateTimeMs(variation: number): number {
        return this._monstersConfigReader.getUpdateTimeFor(variation);
    }

    getMonsterPath(variation: number): [number, number][] {
        return this._monstersConfigReader.getPathFor(variation);
    }

    getWallsLayer(): number[][] {
        const tiles = this._layoutConfigReader.mapStaticLayer({
            wall: variation => this._wallConfigReader.getTileFor(variation),
            door: variation => this._doorsConfigReader.getTileForClosedDoor(variation),
            garniture: variation => this._garnitureConfigReader.getTileFor(variation),
            unoccupied: () => _TILE_UNNOCUPIED,
        });

        const expandedTiles = clamp2D(tiles, _TILE_UNNOCUPIED, 
            [
                Math.max(0, this._availableSize[1] - this._outerWallsPadding * 2),
                Math.max(0, this._availableSize[0] - this._outerWallsPadding * 2),
            ]);

        return pad2D(expandedTiles, this._wallConfigReader.getDefaultTile(), this._outerWallsPadding);
    }

    doesCollideAt(i: number, j: number): boolean {
        if (i < this._outerWallsPadding || i >= (this._availableSize[1] - this._outerWallsPadding) ||
            j < this._outerWallsPadding || j >= (this._availableSize[0] - this._outerWallsPadding)) {
            return true;
        }

        const tile = this._layoutConfigReader.getTileCodeAt(
            i - this._outerWallsPadding,
            j - this._outerWallsPadding
        );
        if (!tile) {
            return false;
        }

        if (this._layoutConfigReader.isWall(tile) ||
            this._layoutConfigReader.isDoor(tile)) {
            return true;
        }

        if (this._layoutConfigReader.isGarniture(tile)) {
            return this._garnitureConfigReader.doesCollide(tile.variation);
        }

        return false;
    }

    private _padAll(points: PointWithVariation[]): PointWithVariation[] {
        return points.map(rp => this._padPoint(rp));
    }

    private _padPoint(point: PointWithVariation): PointWithVariation {
        const paddedI = point[0] + this._outerWallsPadding;
        const paddedJ = point[1] + this._outerWallsPadding;
        return [paddedI, paddedJ, point[2]];
    }

    /**
     * 
     * @param availableSize [width, height]
     */
    static fromConfig(
        availableSize: [number, number],
        layout: RawLayout,
        characterConfig?: CharacterConfig,
        coinsConfig?: CoinsConfig,
        doorsConfig?: DoorsConfig,
        flagConfig?: VariableTileAppearance,
        garnitureConfig?: GarnitureConfig,
        monstersConfig?: MonstersConfig[],
        wallConfig?: VariableTileAppearance,
    ): MazeInitialState | undefined {
        const layoutConfigReader = LayoutConfigReader.create(layout);
        const characterConfigReader: CharacterConfigReader = CharacterConfigReader.create(characterConfig);
        const coinsConfigReader: CoinsConfigReader = CoinsConfigReader.create(coinsConfig);
        const doorsConfigReader: DoorsConfigReader = DoorsConfigReader.create(doorsConfig);
        const flagConfigReader: FlagConfigReader = FlagConfigReader.create(flagConfig);
        const garnitureConfigReader: GarnitureConfigReader = GarnitureConfigReader.create(garnitureConfig);
        const monstersConfigReader: MonstersConfigReader | undefined = MonstersConfigReader.create(monstersConfig);
        const wallConfigReader: WallConfigReader = WallConfigReader.create(wallConfig);

        if (!layoutConfigReader || !monstersConfigReader) {
            return undefined;
        }

        return new MazeInitialState(availableSize,
            layoutConfigReader, characterConfigReader, coinsConfigReader,
            doorsConfigReader, flagConfigReader, garnitureConfigReader,
            monstersConfigReader, wallConfigReader);
    }
};

export default MazeInitialState;
export type { PointWithVariation };
