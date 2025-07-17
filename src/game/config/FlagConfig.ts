import defaultFlagVariationConfig from "@assets/configs/default_flags_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import TileVariationReader from "@game/config/TileVariationReader";

class FlagConfig {
    private readonly _tileVariationReader: TileVariationReader;
    
    constructor(tileVariationReader: TileVariationReader) {
        this._tileVariationReader = tileVariationReader;
    }

    getTileFor(variation?: number): number {
        return this._tileVariationReader.getTileFor(variation);
    }

    public static create(appearance?: VariableTileAppearance): FlagConfig {
        const reader = TileVariationReader.fromConfig(appearance ?? 
            (defaultFlagVariationConfig as VariableTileAppearance));
        return new FlagConfig(reader);
    }
}

export default FlagConfig;
