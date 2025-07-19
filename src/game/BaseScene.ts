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
        
        this.load.bitmapFont("bitpotion", "BitPotion.png", "BitPotion.xml");

        this.load.audio("levelstart", ["levelstart.wav"]);
        this.load.audio("timeup", ["timeup.wav"]);
        this.load.audio("gameover", ["gameover.wav"]);
        this.load.audio("pickup", ["pickup.wav"]);
        this.load.audio("night", ["night.wav"]);
        this.load.audio("victory", ["victory.wav"]);
        this.load.audio("walk", ["walk.wav"]);
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

    onModifyPipeline(_pipeline: string[]) {
        // Empty on purpose.
    }
};

export default BaseScene;
export type { BaseSceneParams };
