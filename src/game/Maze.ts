import type { Result } from "@/util/Result";
import { succeed, error, requireValue } from "@/util/Result";

type ConfigMetaData = {
    spawnSymbol: string;
    wallSymbol: string;
    coinSymbols: string[];
    keySymbols: [string, string][];
};
type ConfigMetaDataError = "line-not-prefixed" | "meta-key-not-found";
type ConfigMetaKeyType = "spawn" | "wall" | "coins" | "keys";

type MazeItemRawType = "unnoccupied" | "spawn" | "wall" | "coin" | "key";

type MazeItemType = {
    id: string;
    rawType: MazeItemRawType;
};

class Maze {

    private readonly items: MazeItemType[][];

    constructor() {
    }

    /**
     * 
     * @param config raw config string.
     */
    static fromConfig(config: string): Maze | undefined {
        const configSplits = config.split(/\r?\n/);

        let fieldSeparator = 0;
        while (fieldSeparator < configSplits.length &&
            configSplits[fieldSeparator].length > 0) {
            fieldSeparator++;
            break;
        }

        const metaDataResult = this._readConfigMeta(configSplits.slice(0, fieldSeparator));
        if (!metaDataResult.success) {
            return undefined;
        }

        if (fieldSeparator >= configSplits.length) {
            return undefined;
        }

        const metaData = requireValue(metaDataResult);
        const dimensions: integer[] = configSplits[fieldSeparator].split(/\s*/).map(parseInt);
        if (dimensions.length !== 2) {
            return undefined;
        }

        const [width, height] = dimensions;

        for (let row = 0; row < height; row++) {
            for (let column = 0; column < width; column++) {
                
            }
        }
    }

    /**
     * Reads config metadata.
     * 
     * Metadata section can be completely empty,
     * if there are no extra maze objects present on the field.
     * Some rows can be optional or empty, and all of them should
     * be prefixed with the information they provide.
     * 
     * The rows are:
     *  spawn: %symbol%
     *  wall: %symbol%
     *  coins: %symbol%[,%symbol% ...]
     *  keys: %key symbol%,%door symbol%[,%key symbol%,%door symbol% ...]
     * 
     * @param meta 
     */
    private static _readConfigMeta(metaSlice: string[]): Result<ConfigMetaData, ConfigMetaDataError> {
        const outConfigMetaData: ConfigMetaData = {
            spawnSymbol: "",
            wallSymbol: "",
            coinSymbols: [],
            keySymbols: [],
        };

        for (const metaRow of metaSlice) {
            const metaParts = metaRow.split(":");

            if (metaParts.length != 2) {
                return error("line-not-prefixed");
            }

            const [metaKey, metaValue] = metaParts;
            switch (metaKey as ConfigMetaKeyType) {
            case "wall": {
                outConfigMetaData.spawnSymbol = metaValue.trim();
                break;
            }
            case "spawn": {
                outConfigMetaData.spawnSymbol = metaValue.trim();
                break;
            }
            case "coins": {
                outConfigMetaData.coinSymbols = metaValue.split(",").map(i => i.trim());
                break;
            }
            case "keys": {
                const out: [string, string][] = [];
                for (let i = 0; i + 1 < metaValue.length; i += 2) {
                    out.push([metaValue[i], metaValue[i + 1]]);
                }
                outConfigMetaData.keySymbols = out;
                break;
            }
            default: {
                // If metaKey does not conforms to ConfigMetaKeyType.
                return error("meta-key-not-found");
            }
            }
        }

        return succeed(outConfigMetaData);
    }
};

export default Maze;
