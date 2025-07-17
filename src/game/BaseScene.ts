import Phaser from "phaser";

import type { GameConfig } from "@game/config/GameConfigReader";

import CathodeRayTubeTvFXPipeline, { KEY_FX_CRT } from "@game/fx/CathodeRayTubeTvFXPipeline";
import FogOfWarFXPipeline, { KEY_FX_FOW } from "@game/fx/FogOfWarFXPipeline";
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

    preload() {
        this.load.setBaseURL(import.meta.env.BASE_URL);

        let filesColourSuffix = "";
        if (this._gameConfigReader?.isUsingColourTiles()) {
            filesColourSuffix = "-colour";
        }

        this.load.image("tileset-main", `tileset${filesColourSuffix}.png`);

        const frameConfig = { 
            frameWidth: this._defaultTileSize,
            frameHeight: this._defaultTileSize
        };
        this.load.spritesheet("elements", `tileset${filesColourSuffix}.png`, frameConfig);
        this.load.spritesheet("characters", `characters${filesColourSuffix}.png`, frameConfig);
        this.load.spritesheet("gems", `gems${filesColourSuffix}.png`, frameConfig);
        this.load.spritesheet("tools", `tools${filesColourSuffix}.png`, frameConfig);
        this.load.spritesheet("creatures", `creatures${filesColourSuffix}.png`, frameConfig);
    }

    create() {
        const { width, height } = this.game.scale;
        this.cameras.main.setBounds(0, 0, width, height);

        const pipeline: string[] = [];

        if (this._gameConfigReader?.shouldUseFogOfWar()) {
            (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer)
                .pipelines
                .addPostPipeline(KEY_FX_FOW, FogOfWarFXPipeline);
            pipeline.push(KEY_FX_FOW);
        }

        if (this._gameConfigReader?.shouldUseCathodRayTubeEffect()) {
            (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer)
                .pipelines
                .addPostPipeline(KEY_FX_CRT, CathodeRayTubeTvFXPipeline);
            pipeline.push(KEY_FX_CRT);
        }

        this.cameras.main.setPostPipeline(pipeline);

        const background = this._gameConfigReader?.background();
        if (background) {
            this.add.rectangle(0, 0,
                this.game.scale.displaySize.width,
                this.game.scale.displaySize.height,
                background);
        }
    }

};

export default BaseScene;
