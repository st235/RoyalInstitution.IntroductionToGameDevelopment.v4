import { assert } from "@/util/Assert";

class TileCode {

    readonly typeCode: string;
    readonly variation: number | undefined;

    /**
     * @param typeCode shorten tile type. Converted to upper case on
     * construction.
     * @param variation a non-negative integer representing the object variation or
     * undefined.
     */
    public constructor(typeCode: string,
        variation?: number) {
        assert(typeof typeCode === "string" && typeCode.length > 0, "Type code should be a string.");
        assert((variation === undefined) || (Number.isSafeInteger(variation) && variation >= 0),
            "Varition should be either not supplied or a non-negative integer.");

        this.typeCode = typeCode.toUpperCase();
        this.variation = variation;
    }

    /**
     * @returns whether the tile code has associated variation.
     */
    public hasVariation(): boolean {
        return this.variation !== undefined;
    }

    /**
     * @returns a string representation of a tile code.
     */
    public toString() {
        return `${this.typeCode}${this.variation ?? ""}`;
    }

    /**
     * Parses raw string tile code,
     * and returns a class represeting the code or {@code undefined} otherwise.
     * 
     * The tile code consists of a shorten tile type and an optional
     * variation. For instance, W0, W2, D9, C11, SP (no variation).
     * 
     * @param rawTileCode is a string representation of the tile code.
     * 
     * @returns a constructed {@link TileCode} object.
     */
    static fromRaw(rawTileCode: string): TileCode | undefined {
        const matchingResult = rawTileCode.match(/^([a-zA-Z]+)(([0-9])|([1-9][0-9]*))?$/);
        if (!matchingResult) {
            return undefined;
        }

        const typeCode = matchingResult[1];
        const variation = matchingResult[2] ? parseInt(matchingResult[2]) : undefined;

        if (!typeCode) {
            return undefined;
        }

        return new TileCode(typeCode, variation);
    }
};

export default TileCode;
