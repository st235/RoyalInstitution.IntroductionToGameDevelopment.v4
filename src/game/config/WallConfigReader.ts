import defaultWallsVariationConfig from "@assets/game/configs/default_walls_variation_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import TileVariationReader from "@game/config/TileVariationReader";

class WallConfigReader {

    private readonly _tileVariationReader: TileVariationReader;
    
    constructor(tileVariationReader: TileVariationReader) {
        this._tileVariationReader = tileVariationReader;
    }

    getDefaultTile(): number {
        return this._tileVariationReader.getDefaultTile();
    }

    getTileFor(variation?: number): number {
        return this._tileVariationReader.getTileFor(variation);
    }

    public static create(config: VariableTileAppearance = defaultWallsVariationConfig): WallConfigReader {
        const reader = TileVariationReader.fromConfig(config);
        return new WallConfigReader(reader);
    }
};

export default WallConfigReader;
