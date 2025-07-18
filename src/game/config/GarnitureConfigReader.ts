import defaultGarnitureConfig from "@assets/configs/default_garniture_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import TileVariationReader from "@game/config/TileVariationReader";

type GarnitureConfig = VariableTileAppearance & {
    collides: number[];
};

class GarnitureConfigReader {

    private readonly _collidableVariations: Set<number>;
    private readonly _tileVariationReader: TileVariationReader;
    
    constructor(config: GarnitureConfig, tileVariationReader: TileVariationReader) {
        this._collidableVariations = new Set<number>();
        this._tileVariationReader = tileVariationReader;

        for (const colliderVariation of config.collides) {
            this._collidableVariations.add(colliderVariation);
        }
    }

    getTileFor(variation?: number): number {
        return this._tileVariationReader.getTileFor(variation);
    }

    doesCollide(variation?: number): boolean {
        if (variation === undefined) {
            return false;
        }
        return this._collidableVariations.has(variation);
    }

    public static create(config: GarnitureConfig = defaultGarnitureConfig): GarnitureConfigReader {
        const reader = TileVariationReader.fromConfig(config);
        return new GarnitureConfigReader(config, reader);
    }
}

export default GarnitureConfigReader;
export type { GarnitureConfig };
