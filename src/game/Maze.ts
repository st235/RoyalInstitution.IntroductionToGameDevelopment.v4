import Phaser from "phaser";

import CharacterConfig from "@game/config/CharacterConfig";
import MazeConfig from "@game/config/MazeConfig";
import WallConfig from "@game/config/WallConfig";

import { pad2D } from "@/util/Arrays";

class Maze {

    private readonly _wallsPadding: number = 1;

    private readonly _layoutConfig: MazeConfig;
    private readonly _characterConfig: CharacterConfig;
    private readonly _wallVariationConfig: WallConfig;

    private _startPositions: [number, number][];
    private _finishPositions: [number, number][];

    constructor(layoutConfig: MazeConfig,
        characterConfig: CharacterConfig,
        wallVariationConfig: WallConfig) {
        this._layoutConfig = layoutConfig;
        this._characterConfig = characterConfig;
        this._wallVariationConfig = wallVariationConfig;

        const groupedStartAndFinishPoints = this._layoutConfig.groupSpawnAndFinishPoints();
        this._startPositions = groupedStartAndFinishPoints[0];
        this._finishPositions = groupedStartAndFinishPoints[1];
    }

    getCharacterTile(): number {
        return this._characterConfig.getTile();
    }

    getStartPosition(): [number, number] {
        const point = Phaser.Math.RND.pick(this._startPositions);
        return [point[0] + this._wallsPadding, point[1] + this._wallsPadding];
    }

    getFinishPosition(): [number, number] {
        const point = Phaser.Math.RND.pick(this._finishPositions);
        return [point[0] + this._wallsPadding, point[1] + this._wallsPadding];
    }

    getWallsLayer(): number[][] {
        const tiles = this._layoutConfig.mapTiles({
            unoccupied: () => -1,
            start: () => -1,
            wall: variation => this._wallVariationConfig.getTileFor(variation),
        });

        return pad2D(tiles, this._wallVariationConfig.getDefaultTile(), this._wallsPadding);
    }

    /**
     * 
     * @param layout raw config string.
     */
    static fromConfig(
        layout: string,
        characterConfig: CharacterConfig = CharacterConfig.create(),
        wallVariationConfig: WallConfig = WallConfig.create(),
    ): Maze | undefined {
        const layoutConfig = MazeConfig.create(layout);
        return new Maze(layoutConfig!, characterConfig, wallVariationConfig);
    }
};

export default Maze;
