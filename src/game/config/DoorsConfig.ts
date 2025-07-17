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
    private readonly _closedDoorsVariationReader: TileVariationReader;
    private readonly _openDoorsVariationReader: TileVariationReader;
    
    constructor(layout: DoorsLayout) {
        this._keysVariationReader = TileVariationReader.fromConfig(layout.key);
        this._closedDoorsVariationReader = TileVariationReader.fromConfig(layout.door.closed);
        this._openDoorsVariationReader = TileVariationReader.fromConfig(layout.door.open);
    }

    getTileForKey(variation?: number): number {
        return this._keysVariationReader.getTileFor(variation);
    }

    getTileForClosedDoor(variation?: number): number {
        return this._closedDoorsVariationReader.getTileFor(variation);
    }

    getTileForOpenDoor(variation?: number): number {
        return this._openDoorsVariationReader.getTileFor(variation);
    }

    public static create(layout: DoorsLayout = defaultDoorsConfig): DoorsConfig {
        return new DoorsConfig(layout);
    }
}

export default DoorsConfig;
