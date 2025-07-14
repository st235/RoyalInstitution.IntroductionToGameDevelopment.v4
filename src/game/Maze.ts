import MazeConfig from "./config/MazeConfig";
import WallConfig from "./config/WallConfig";

import { pad2D } from "@/util/Arrays";

class Maze {

    private readonly _config: MazeConfig;
    private readonly _wallVariationConfig: WallConfig;

    constructor(config: MazeConfig, wallVariationConfig: WallConfig) {
        this._config = config;
        this._wallVariationConfig = wallVariationConfig;
    }

    getWallsLayer(): number[][] {
        const tiles = this._config.getMappedTiles({
            unoccupied: () => -1,
            wall: variation => this._wallVariationConfig.getTileFor(variation),
        });

        return pad2D(tiles, this._wallVariationConfig.getDefaultTile(), 1);
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
