import defaultConfig from "@assets/configs/default_tile_symbols_mapping.json";

import { assert } from "@/util/Assert";
import TileCode from "@game/config/TileCode";

type TileTypeCodeMapping = {
    readonly start: string;
    readonly finish: string;
    readonly wall: string;
    readonly coin: string;
    readonly key: string;
    readonly door: string;
    readonly monster: string;
};

class TileCodeMapper {

    private readonly _typeCodeMapping: TileTypeCodeMapping;

    public constructor(typeCodeMapping: TileTypeCodeMapping) {
        assert(typeCodeMapping && Object.keys(typeCodeMapping).length > 0);

        let configKey: keyof TileTypeCodeMapping;
        for (configKey in typeCodeMapping) {
            const configValue = typeCodeMapping[configKey];
            assert((typeof configValue === "string") && configValue.length > 0);
        }

        this._typeCodeMapping = typeCodeMapping;
    }

    /**
     * Checks whether the passed {@link TileCode} is start point.
     * 
     * @param tileCode to check.
     * @returns {@code true} if the passed object is start point and
     * {@code false} otherwise.
     */
    public isStartPoint(tileCode: TileCode): boolean {
        return this._typeCodeMapping.start === tileCode.typeCode;
    }

    /**
     * Checks whether the passed {@link TileCode} is finish point.
     * 
     * @param tileCode to check.
     * @returns {@code true} if the passed object is finish point and
     * {@code false} otherwise.
     */
    public isFinishPoint(tileCode: TileCode): boolean {
        return this._typeCodeMapping.finish === tileCode.typeCode;
    }

    /**
     * Checks whether the passed {@link TileCode} is a wall.
     * 
     * @param tileCode to check.
     * @returns {@code true} if the passed object is a wall and {@code false} otherwise.
     */
    public isWall(tileCode: TileCode): boolean {
        return this._typeCodeMapping.wall === tileCode.typeCode;
    }

    /**
     * Checks whether the passed {@link TileCode} is a coin.
     * 
     * @param tileCode to check.
     * @returns {@code true} if the passed object is a coin and {@code false} otherwise.
     */
    public isCoin(tileCode: TileCode): boolean {
        return this._typeCodeMapping.coin === tileCode.typeCode;
    }

    /**
     * Checks whether the passed {@link TileCode} is a key.
     * 
     * @param tileCode to check.
     * @returns {@code true} if the passed object is a key and {@code false} otherwise.
     */
    public isKey(tileCode: TileCode): boolean {
        return this._typeCodeMapping.key === tileCode.typeCode;
    }

    /**
     * Checks whether the passed {@link TileCode} is a door.
     * 
     * @param tileCode to check.
     * @returns {@code true} if the passed object is a door and {@code false} otherwise.
     */
    public isDoor(tileCode: TileCode): boolean {
        return this._typeCodeMapping.door === tileCode.typeCode;
    }

    /**
     * Checks whether the passed {@link TileCode} is a monster.
     * 
     * @param tileCode to check.
     * @returns {@code true} if the passed object is a monster and {@code false} otherwise.
     */
    public isMonster(tileCode: TileCode): boolean {
        return this._typeCodeMapping.monster === tileCode.typeCode;
    }

    /**
     * Creates a mapping profile for all entitines on the config map,
     * from the provided tile type codes.
     * 
     * @param config with a tile type codes mapping.
     * @returns an instance on {@link TileCodeMapper}.
     * 
     * @see TileTypeCodeMapping
     * @see default_tile_symbols_mapping.json
     */
    public static fromConfig(config: TileTypeCodeMapping = this.defaultConfig()): TileCodeMapper | undefined {
        if (!config || Object.keys(config).length <= 0) {
            return undefined;
        }

        let configKey: keyof TileTypeCodeMapping;
        for (configKey in config) {
            const configValue = config[configKey];
            if((typeof configValue !== "string") || configValue.length <= 0) {
                return undefined;
            }
        }

        return new TileCodeMapper(config);
    }

    private static defaultConfig(): TileTypeCodeMapping {
        return defaultConfig as TileTypeCodeMapping;
    }
};

export default TileCodeMapper;
export type { TileTypeCodeMapping };
