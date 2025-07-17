import defaultDoorsConfig from "@assets/configs/default_doors_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import TileVariationReader from "@game/config/TileVariationReader";

type DoorsLayout = {
    key: VariableTileAppearance;
    door: {
        open: VariableTileAppearance;
        closed: VariableTileAppearance;
    }
};

class DoorsConfig {

    private readonly _keysVariationReader: TileVariationReader;
    
    constructor(layout: DoorsLayout) {
        this._keysVariationReader = TileVariationReader.fromConfig(layout.key);
    }

    getTileForKey(variation?: number): number {
        return this._keysVariationReader.getTileFor(variation);
    }

    public static create(layout: DoorsLayout = defaultDoorsConfig): DoorsConfig {
        return new DoorsConfig(layout);
    }
}

export default DoorsConfig;
