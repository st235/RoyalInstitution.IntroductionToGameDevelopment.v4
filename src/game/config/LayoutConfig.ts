import type { TileTypeCodeMapping } from "@game/config/TileCodeMapper";

import TileCode from "@game/config/TileCode";
import TileCodeMapper from "@game/config/TileCodeMapper";

const KEY_START_POINT = 0;
const KEY_FINISH_POINT = 1;
const KEY_COIN = 2;

type OptionalTileCode = TileCode | undefined;

type RenderingTilesMapper<T> = {
    unoccupied: () => T;
    wall: (variation?: number) => T;
}

class LayoutConfig {

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

    mapStaticLayer<T = unknown>(renderingMapper: RenderingTilesMapper<T>): T[][] {
        return this._tiles.map(items => {
            return items.map(item => {
                if (item && this._tileCodeMapper.isWall(item)) {
                    return renderingMapper.wall(item.variation);
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

    public static create(config: string, mapping?: TileTypeCodeMapping): LayoutConfig | undefined {
        const mapper = TileCodeMapper.fromConfig(mapping);
        if (!mapper) {
            return undefined;
        }

        const tiles: OptionalTileCode[][] = config.trim().split(/\r?\n/)
            .filter(l => l.length > 0)
            .map(l => l.trim().split(/\s+/).map(i => TileCode.fromRaw(i)));

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

        return new LayoutConfig([width, height], tiles, mapper);
    }
};

export default LayoutConfig;
export { KEY_START_POINT, KEY_FINISH_POINT, KEY_COIN };
