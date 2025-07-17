import defaultCoinsConfig from "@assets/configs/default_coins_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import TileVariationReader from "@game/config/TileVariationReader";

type CoinInfo = {
    variant: number,
    score: number,
};

type CoinsDescriptor = VariableTileAppearance & {
    defaultScore?: number;
    coins?: CoinInfo[];
};

class CoinsConfig {
    private readonly _coinsDescriptor: CoinsDescriptor;
    private readonly _coinInfoLookup: { [Key: string]: CoinInfo };
    private readonly _tileVariationReader: TileVariationReader;
    
    constructor(coinsInfo: CoinsDescriptor, tileVariationReader: TileVariationReader) {
        this._coinsDescriptor = coinsInfo;

        this._coinInfoLookup = {};
        const coinInfos = coinsInfo.coins ?? [];
        for (const coinInfo of coinInfos) {
            this._coinInfoLookup[coinInfo.variant] = coinInfo;
        }

        this._tileVariationReader = tileVariationReader;
    }

    getTileFor(variation?: number): number {
        return this._tileVariationReader.getTileFor(variation);
    }

    getScoreFor(variation?: number): number {
        const defaultScore = this._coinsDescriptor.defaultScore ?? 0;

        if (variation === undefined) {
            return defaultScore;
        }

        return this._coinInfoLookup[variation]?.score ?? defaultScore;
    }

    public static create(appearance?: CoinsDescriptor): CoinsConfig {
        const coinsInfo = defaultCoinsConfig as CoinsDescriptor;
        const reader = TileVariationReader.fromConfig(appearance ?? coinsInfo);
        return new CoinsConfig(coinsInfo, reader);
    }
}

export default CoinsConfig;
