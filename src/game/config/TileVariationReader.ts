import { assert } from "@/util/Assert";

/**
 * Default interface for an object that provides appearance alterations.
 */
interface VariableTileAppearance {
    /**
     * An optional default variation id.
     * Is used when {@link getTileFor} is called without providing a variation.
     * If not specified, fall backs to 0.
     */
    defaultVariation?: number;
    /**
     * An optional variation id used when the provided variation id
     * cannot be used for some reason.
     * Can be used for specifying error situations.
     */
    unknownVariation?: number;

    /**
     * Non-empty array of tile ids. The order in which the ids are specificed 
     * corresponds to the variation id. The very first tile id has variation id
     * equal to 0.
     * 
     * This information can be associated with a {@link TileCode} variation.
     * For instance, if a tile code with a type code F is used for a flag,
     * F0 can correspond to a yellow flag, F1 to a red flag, F2 to a blue flag,
     * and so on.
     */
    variations: number[];
};

class TileVariationReader {

    private readonly _variationToTileLookup: number[];
    private readonly _defaultVariation: number;
    private readonly _unknownVariation?: number;

    constructor(variations: number[],
        defaultVariation?: number,
        unknownVariation?: number) {
        assert(Array.isArray(variations) && variations.length > 0);

        assert(defaultVariation == undefined ||
            (Number.isSafeInteger(defaultVariation) &&
            defaultVariation >= 0 && defaultVariation < variations.length));
        assert(unknownVariation == undefined ||
            (Number.isSafeInteger(unknownVariation) &&
            unknownVariation >= 0 && unknownVariation < variations.length));

        this._variationToTileLookup = variations;
        this._defaultVariation = defaultVariation ?? 0;
        this._unknownVariation = unknownVariation;
    }

    /**
     * @returns a tile corresponding to the default (aka unspecified) variation.
     */
    public getDefaultTile(): number {
        return this._variationToTileLookup[this._defaultVariation];
    }

    /**
     * @param variation for which we request the tile.
     * @returns a tile corresponding to the given variation, or
     * {@link getDefaultTile} if unspecified.
     */
    public getTileFor(variation?: number): number {
        if (!variation) {
            return this.getDefaultTile();
        }
        if (variation < 0 || variation >= this._variationToTileLookup.length) {
            if (this._unknownVariation) {
                return this._variationToTileLookup[this._unknownVariation];
            } else {
                return this.getDefaultTile();
            }
        }
        return this._variationToTileLookup[variation];
    }

    public static fromConfig(appearance: VariableTileAppearance): TileVariationReader {
        return new TileVariationReader(appearance.variations,
            appearance.defaultVariation, appearance.unknownVariation);
    }
};

export default TileVariationReader;
export type { VariableTileAppearance };
