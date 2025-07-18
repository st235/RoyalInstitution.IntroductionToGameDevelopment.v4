import type { TileTypeCodeMapping } from "@game/config/TileCodeMapper";

import TileCode from "@game/config/TileCode";
import TileCodeMapper from "@game/config/TileCodeMapper";

const KEY_START_POINT = 0;
const KEY_FINISH_POINT = 1;
const KEY_COIN = 2;
const KEY_KEY = 3;
const KEY_DOOR = 4;
const KEY_MONSTER = 5;

type OptionalTileCode = TileCode | undefined;

type RenderingTilesMappers<T> = {
    unoccupied: () => T;
    wall: (variation?: number) => T;
    door: (variation?: number) => T;
    garniture: (variation?: number) => T;
}

type RawLayout = string[] | string;

class LayoutConfigReader {

    private readonly _dimensions: [number, number];
    private readonly _tiles: OptionalTileCode[][];
    private readonly _tileCodeMapper: TileCodeMapper;

    constructor(dimensions: [number, number], tiles: OptionalTileCode[][],
        tileCodeMapper: TileCodeMapper) {
        this._dimensions = dimensions;
        this._tiles = tiles;
        this._tileCodeMapper = tileCodeMapper;
    }

    getDimensions(): [number, number] {
        return [this._dimensions[0], this._dimensions[1]];
    }

    getTileCodeAt(i: number, j: number): OptionalTileCode {
        if (!this._tiles[i]) {
            return undefined;
        }
        return this._tiles[i][j];
    }

    isWall(tileCode: TileCode): boolean {
        return this._tileCodeMapper.isWall(tileCode);
    }

    isDoor(tileCode: TileCode): boolean {
        return this._tileCodeMapper.isDoor(tileCode);
    }

    isGarniture(tileCode: TileCode): boolean {
        return this._tileCodeMapper.isGarniture(tileCode);
    }

    mapStaticLayer<T = unknown>(renderingMapper: RenderingTilesMappers<T>): T[][] {
        return this._tiles.map(items => {
            return items.map(item => {
                if (item && this._tileCodeMapper.isWall(item)) {
                    return renderingMapper.wall(item.variation);
                }
                if (item && this._tileCodeMapper.isDoor(item)) {
                    return renderingMapper.door(item.variation);
                }
                if (item && this._tileCodeMapper.isGarniture(item)) {
                    return renderingMapper.garniture(item.variation);
                }
                return renderingMapper.unoccupied();
            });
        });
    }

    groupDynamicObjects(): {[Key: string]: [number, number, number | undefined][]} {
        return this._groupPositions(item => {
            if (item && this._tileCodeMapper.isStartPoint(item)) {
                return KEY_START_POINT;
            }
            if (item && this._tileCodeMapper.isFinishPoint(item)) {
                return KEY_FINISH_POINT;
            }
            if (item && this._tileCodeMapper.isCoin(item)) {
                return KEY_COIN;
            }
            if (item && this._tileCodeMapper.isKey(item)) {
                return KEY_KEY;
            }
            if (item && this._tileCodeMapper.isDoor(item)) {
                return KEY_DOOR;
            }
            if (item && this._tileCodeMapper.isMonster(item)) {
                return KEY_MONSTER;
            }
            return undefined;
        });
    }

    private _groupPositions(groupingPredicate: (item: OptionalTileCode) => (number | undefined)): {[Key: string]: [number, number, number | undefined][]} {
        const out: {[Key: string]: [number, number, number | undefined][]} = {};

        for (let i = 0; i < this._tiles.length; i++) {
            for (let j = 0; j < this._tiles[i].length; j++) {
                const group = groupingPredicate(this._tiles[i][j]);
                if (group === undefined) {
                    continue;
                }

                if (!out[group]) {
                    out[group] = [];
                }

                const variation = this._tiles[i][j]?.variation;
                out[group].push([i, j, variation]);
            }
        }

        return out;
    }

    public static create(rawLayout: RawLayout, mapping?: TileTypeCodeMapping): LayoutConfigReader | undefined {
        const mapper = TileCodeMapper.fromConfig(mapping);
        if (!mapper) {
            return undefined;
        }

        let layout: string[];
        if (Array.isArray(rawLayout)) {
            layout = rawLayout;
        } else {
            layout = rawLayout
                .trim()
                .split(/\r?\n/)
                .filter(l => l.length > 0);
        }

        const tiles: OptionalTileCode[][] = layout.map(l => 
            l.trim()
                .split(/\s+/)
                .map(i => TileCode.fromRaw(i))
        );

        const height = tiles.length;
        if (height <= 0) {
            return undefined;
        }

        const width = tiles[0].length;
        if (width <= 0) {
            return undefined;
        }

        for (let row = 0; row < tiles.length; row++) {
            if (tiles[row].length != width) {
                return undefined;
            }
        }

        return new LayoutConfigReader([width, height], tiles, mapper);
    }
};

export default LayoutConfigReader;
export { KEY_START_POINT, KEY_FINISH_POINT, KEY_COIN, KEY_KEY, KEY_DOOR, KEY_MONSTER };
export type { RawLayout };
