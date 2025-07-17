import defaultDoorsConfig from "@assets/configs/default_doors_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import TileVariationReader from "@game/config/TileVariationReader";

type DoorsConfig = {
    key: VariableTileAppearance;
    door: {
        open: VariableTileAppearance;
        closed: VariableTileAppearance;
    }
};

class DoorsConfigReader {

    private readonly _keysVariationReader: TileVariationReader;
    private readonly _closedDoorsVariationReader: TileVariationReader;
    private readonly _openDoorsVariationReader: TileVariationReader;
    
    constructor(doorsConfig: DoorsConfig) {
        this._keysVariationReader = TileVariationReader.fromConfig(doorsConfig.key);
        this._closedDoorsVariationReader = TileVariationReader.fromConfig(doorsConfig.door.closed);
        this._openDoorsVariationReader = TileVariationReader.fromConfig(doorsConfig.door.open);
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

    public static create(doorsConfig: DoorsConfig = defaultDoorsConfig): DoorsConfigReader {
        return new DoorsConfigReader(doorsConfig);
    }
}

export default DoorsConfigReader;
