import defaultFlagVariationConfig from "@assets/configs/default_flags_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import TileVariationReader from "@game/config/TileVariationReader";

class FlagConfigReader {
    private readonly _tileVariationReader: TileVariationReader;
    
    constructor(tileVariationReader: TileVariationReader) {
        this._tileVariationReader = tileVariationReader;
    }

    getTileFor(variation?: number): number {
        return this._tileVariationReader.getTileFor(variation);
    }

    public static create(config: VariableTileAppearance = defaultFlagVariationConfig): FlagConfigReader {
        const reader = TileVariationReader.fromConfig(config);
        return new FlagConfigReader(reader);
    }
}

export default FlagConfigReader;
