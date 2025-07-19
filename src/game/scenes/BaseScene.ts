import Phaser from "phaser";

import type { GameConfig } from "@game/config/GameConfigReader";

import CathodeRayTubeTvFXPipeline, { KEY_FX_CRT } from "@game/fx/CathodeRayTubeTvFXPipeline";
import GameConfigReader from "@game/config/GameConfigReader";

type BaseSceneParams = {
    gameConfig?: GameConfig;
};

class BaseScene extends Phaser.Scene {

    protected readonly _defaultTileSize: number;

    protected _gameConfigReader?: GameConfigReader;

    constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);

        this._defaultTileSize = 10;
    }

    init(data: BaseSceneParams) {
        this._gameConfigReader = GameConfigReader.create(data.gameConfig);
    }

    create() {
        const { width, height } = this.game.scale;
        this.cameras.main.setBounds(0, 0, width, height);

        const pipeline: string[] = [];

        this.onModifyPipeline(pipeline);

        if (this._gameConfigReader?.shouldUseCathodRayTubeEffect()) {
            (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer)
                .pipelines
                .addPostPipeline(KEY_FX_CRT, CathodeRayTubeTvFXPipeline);
            pipeline.push(KEY_FX_CRT);
        }

        this.cameras.main.setPostPipeline(pipeline);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onModifyPipeline(_pipeline: string[]) {
        // Empty on purpose.
    }
};

export default BaseScene;
export type { BaseSceneParams };
