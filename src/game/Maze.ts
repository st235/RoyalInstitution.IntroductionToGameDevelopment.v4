import Phaser from "phaser";

import MazeConfig from "@game/config/MazeConfig";
import WallConfig from "@game/config/WallConfig";

import { pad2D } from "@/util/Arrays";

class Maze {

    private readonly _wallsPadding: number = 1;

    private readonly _config: MazeConfig;
    private readonly _wallVariationConfig: WallConfig;

    private _startPositions: [number, number][];
    private _finishPositions: [number, number][];

    constructor(config: MazeConfig, wallVariationConfig: WallConfig) {
        this._config = config;
        this._wallVariationConfig = wallVariationConfig;

        const groupedStartAndFinishPoints = this._config.groupSpawnAndFinishPoints();
        this._startPositions = groupedStartAndFinishPoints[0];
        this._finishPositions = groupedStartAndFinishPoints[1];
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
        const tiles = this._config.mapTiles({
            unoccupied: () => -1,
            start: () => -1,
            wall: variation => this._wallVariationConfig.getTileFor(variation),
        });

        return pad2D(tiles, this._wallVariationConfig.getDefaultTile(), this._wallsPadding);
    }

    /**
     * 
     * @param config raw config string.
     */
    static fromConfig(config: string): Maze | undefined {
        const wallVariationConfig = WallConfig.create();
        const mazeConfig = MazeConfig.fromConfig(config);

        return new Maze(mazeConfig!, wallVariationConfig);
    }
};

export default Maze;
