import type { TileTypeCodeMapping } from "@game/config/TileCodeMapper";

import TileCode from "@game/config/TileCode";
import TileCodeMapper from "@game/config/TileCodeMapper";

type OptionalTileCode = TileCode | undefined;

type RenderingTilesMapper<T> = {
    unoccupied: () => T;
    wall: (variation?: number) => T;
    start: (position: [number, number]) => T;
}

class MazeConfig {

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

    mapTiles<T = unknown>(renderingMapper: RenderingTilesMapper<T>): T[][] {
        return this._tiles.map((items, row) => {
            return items.map((item, column) => {
                if (!item) {
                    return renderingMapper.unoccupied();
                }

                if (this._tileCodeMapper.isWall(item)) {
                    return renderingMapper.wall(item.variation);
                }

                if (this._tileCodeMapper.isStartPoint(item)) {
                    return renderingMapper.start([row, column]);
                }

                throw new Error("Unrecognised type.");
            });
        });
    }

    groupSpawnAndFinishPoints(): {[Key: string]: [number, number][]} {
        return this._groupPositions(item => {
            if (item && this._tileCodeMapper.isStartPoint(item)) {
                return 0;
            }

            if (item && this._tileCodeMapper.isFinishPoint(item)) {
                return 1;
            }

            return undefined;
        });
    }

    private _groupPositions(groupingPredicate: (item: OptionalTileCode) => (number | undefined)): {[Key: string]: [number, number][]} {
        const out: {[Key: string]: [number, number][]} = {};

        for (let i = 0; i < this._tiles.length; i++) {
            for (let j = 0; j < this._tiles[i].length; j++) {
                const group = groupingPredicate(this._tiles[i][j]);
                if (group === undefined) {
                    continue;
                }

                if (!out[group]) {
                    out[group] = [];
                }

                out[group].push([i, j]);
            }
        }

        return out;
    }

    public static create(config: string, mapping?: TileTypeCodeMapping): MazeConfig | undefined {
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

        return new MazeConfig([width, height], tiles, mapper);
    }
};

export default MazeConfig;
