import Phaser from "phaser";

import type { BaseSceneParams } from "@game/BaseScene";
import type { LevelConfig } from "@game/config/LevelConfigReader";

import BaseScene from "@game/BaseScene";
import FogOfWarFXPipeline, { KEY_FX_FOW } from "@game/fx/FogOfWarFXPipeline";
import LevelConfigReader from "@game/config/LevelConfigReader";
import MazeInitialState from "@/game/state/MazeInitialState";

import MazeSubScene from "@game/MazeSubScene";

type MazeSceneParams = BaseSceneParams & {
    levelConfig: LevelConfig;
};

class MazeScene extends BaseScene {

    private _levelConfigReader?: LevelConfigReader;
    private _mazeSubScene?: MazeSubScene;

    constructor() {
        super({
            key: "MazeScene",
        });

        this._onMovedListener = this._onMovedListener.bind(this);
        this._onScoreListener = this._onScoreListener.bind(this);
        this._onReachedFinishListener = this._onReachedFinishListener.bind(this);
        this._onGameOverListener = this._onGameOverListener.bind(this);
    }

    init(data: MazeSceneParams) {
        super.init(data);
        this._levelConfigReader = LevelConfigReader.create(data.levelConfig);
    }

    onModifyPipeline(pipeline: string[]): void {
        if (this._levelConfigReader?.shouldUseFogOfWar()) {
            (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer)
                .pipelines
                .addPostPipeline(KEY_FX_FOW, FogOfWarFXPipeline);
            pipeline.push(KEY_FX_FOW);
        }
    }

    create() {
        super.create();

        const background = this._levelConfigReader?.background();
        if (background) {
            this.add.rectangle(0, 0,
                this.game.scale.displaySize.width,
                this.game.scale.displaySize.height,
                background);
        }

        const { width, height } = this.game.scale;
        const [paddingLeft, paddingTop, paddingRight, paddingBottom] = [0, this._defaultTileSize, 0, 0];
        const [mazeWidth, mazeHeight] = [width - paddingLeft - paddingRight, height - paddingTop - paddingBottom];

        const mazeInitialState = MazeInitialState.fromConfig(
            [mazeWidth / this._defaultTileSize, mazeHeight / this._defaultTileSize],
            this._levelConfigReader!.getLevelLayout(),
            this._gameConfigReader?.getCharacterConfig(),
            this._gameConfigReader?.getCoinsConfig(),
            this._gameConfigReader?.getDoorsConfig(),
            this._gameConfigReader?.getFlagsConfig(),
            this._gameConfigReader?.getGarnitureConfig(),
            this._gameConfigReader?.getMonstersConfig(),
            this._gameConfigReader?.getWallsConfig(),
        );

        if (!mazeInitialState) {
            throw new Error("Unable to build maze initial state.");
        }

        this._mazeSubScene = new MazeSubScene(this, mazeInitialState, this._defaultTileSize, paddingLeft, paddingTop, mazeWidth, mazeHeight);
        this._mazeSubScene?.setOnMovedListener(this._onMovedListener);
        this._mazeSubScene?.setOnScoreListener(this._onScoreListener);
        this._mazeSubScene?.setOnReachedFinishListener(this._onReachedFinishListener);
        this._mazeSubScene?.setOnGameOverListener(this._onGameOverListener);

        this._mazeSubScene?.placeFlag();
    }

    update(timeMs: number) {
        this._mazeSubScene?.update(timeMs);
    }

    private _onMovedListener() {
        console.log("On player moved");
    }

    private _onScoreListener(score: number) {
        console.log("On player scored: " + score);
    }

    private _onReachedFinishListener() {
        console.log("On player reached finish");
    }

    private _onGameOverListener() {
        console.log("On game over");
    }
};

export default MazeScene;
export type { MazeSceneParams };
