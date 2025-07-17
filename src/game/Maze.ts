import Phaser from "phaser";

import CharacterConfig from "@game/config/CharacterConfig";
import CoinsConfig from "@game/config/CoinsConfig";
import FlagConfig from "@game/config/FlagConfig";
import LayoutConfig, { KEY_START_POINT, KEY_FINISH_POINT, KEY_COIN } from "@/game/config/LayoutConfig";
import WallConfig from "@game/config/WallConfig";

import { pad2D } from "@/util/Arrays";

/**
 * Tuple represeting i, j position of a tile on a grid,
 * plus an optional variation.
 */
type PointWithVariation = [number, number, number | undefined];

class Maze {

    private readonly _outerWallsPadding: number = 1;

    private readonly _layoutConfig: LayoutConfig;
    private readonly _characterConfig: CharacterConfig;
    private readonly _coinsConfig: CoinsConfig;
    private readonly _flagConfig: FlagConfig;
    private readonly _wallVariationConfig: WallConfig;

    private _startPositions: PointWithVariation[];
    private _finishPositions: PointWithVariation[];
    private _coinsPositions: PointWithVariation[];

    constructor(layoutConfig: LayoutConfig,
        characterConfig: CharacterConfig,
        coinsConfig: CoinsConfig,
        flagConfig: FlagConfig,
        wallVariationConfig: WallConfig) {
        this._layoutConfig = layoutConfig;
        this._characterConfig = characterConfig;
        this._coinsConfig = coinsConfig;
        this._flagConfig = flagConfig;
        this._wallVariationConfig = wallVariationConfig;

        const groupedDynamicObjects = this._layoutConfig.groupDynamicObjects();
        this._startPositions = this._padAll(groupedDynamicObjects[KEY_START_POINT]) ?? [];
        this._finishPositions = this._padAll(groupedDynamicObjects[KEY_FINISH_POINT]) ?? [];
        this._coinsPositions = this._padAll(groupedDynamicObjects[KEY_COIN]) ?? [];
    }

    getCharacterTile(): number {
        return this._characterConfig.getTile();
    }

    getFlagTile(variation?: number): number {
        return this._flagConfig.getTileFor(variation);
    }

    getCoinTile(variation?: number): number {
        return this._coinsConfig.getTileFor(variation);
    }

    getCoinScore(variation?: number): number {
        return this._coinsConfig.getScoreFor(variation);
    }

    getStartPoint(): PointWithVariation {
        return Phaser.Math.RND.pick(this._startPositions);
    }

    getFinishPoint(): PointWithVariation {
        return Phaser.Math.RND.pick(this._finishPositions);
    }

    getCoins(): PointWithVariation[] {
        return this._coinsPositions;
    }

    getWallsLayer(): number[][] {
        const tiles = this._layoutConfig.mapStaticLayer({
            wall: variation => this._wallVariationConfig.getTileFor(variation),
            unoccupied: () => -1,
        });
        return pad2D(tiles, this._wallVariationConfig.getDefaultTile(), this._outerWallsPadding);
    }

    private _padAll(points: PointWithVariation[]): PointWithVariation[] {
        return points.map(rp => this._padPoint(rp));
    }

    private _padPoint(point: PointWithVariation): PointWithVariation {
        const paddedI = point[0] + this._outerWallsPadding;
        const paddedJ = point[1] + this._outerWallsPadding;
        return [paddedI, paddedJ, point[2]];
    }

    /**
     * 
     * @param layout raw config string.
     */
    static fromConfig(
        layout: string,
        characterConfig: CharacterConfig = CharacterConfig.create(),
        coinsConfig: CoinsConfig = CoinsConfig.create(),
        flagConfig: FlagConfig = FlagConfig.create(),
        wallVariationConfig: WallConfig = WallConfig.create(),
    ): Maze | undefined {
        const layoutConfig = LayoutConfig.create(layout);
        return new Maze(layoutConfig!, characterConfig, coinsConfig,
            flagConfig, wallVariationConfig);
    }
};

export default Maze;
export type { PointWithVariation };
