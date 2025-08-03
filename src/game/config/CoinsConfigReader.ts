import defaultCoinsConfig from "@assets/game/configs/default_coins_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";

import TileVariationReader from "@game/config/TileVariationReader";

type CoinInfo = {
    variant: number;
    score: number;
};

type CoinsConfig = VariableTileAppearance & {
    defaultScore?: number;
    coins?: CoinInfo[];
};

class CoinsConfigReader {

    private readonly _coinsConfig: CoinsConfig;
    private readonly _coinInfoLookup: { [Key: string]: CoinInfo };
    private readonly _tileVariationReader: TileVariationReader;
    
    constructor(coinsConfig: CoinsConfig, tileVariationReader: TileVariationReader) {
        this._coinsConfig = coinsConfig;

        this._coinInfoLookup = {};
        const coinInfos = coinsConfig.coins ?? [];
        for (const coinInfo of coinInfos) {
            this._coinInfoLookup[coinInfo.variant] = coinInfo;
        }

        this._tileVariationReader = tileVariationReader;
    }

    getTileFor(variation?: number): number {
        return this._tileVariationReader.getTileFor(variation);
    }

    getScoreFor(variation?: number): number {
        const defaultScore = this._coinsConfig.defaultScore ?? 0;

        if (variation === undefined) {
            return defaultScore;
        }

        return this._coinInfoLookup[variation]?.score ?? defaultScore;
    }

    public static create(coinsConfig: CoinsConfig = defaultCoinsConfig): CoinsConfigReader {
        const reader = TileVariationReader.fromConfig(coinsConfig);
        return new CoinsConfigReader(coinsConfig, reader);
    }
}

export default CoinsConfigReader;
export type { CoinsConfig, CoinInfo };
