import defaultWallsVariationConfig from "@assets/configs/default_walls_variation_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import TileVariationReader from "@game/config/TileVariationReader";

class WallConfig {

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

    public static create(appearance?: VariableTileAppearance): WallConfig {
        const reader = TileVariationReader.fromConfig(appearance ?? 
            (defaultWallsVariationConfig as VariableTileAppearance));
        return new WallConfig(reader);
    }
};

export default WallConfig;
