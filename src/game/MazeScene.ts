import Phaser from "phaser";

import type { BaseSceneParams } from "@game/BaseScene";
import type { LevelConfig } from "@game/config/LevelConfigReader";

import BaseScene from "@game/BaseScene";
import ConstraintsTracker from "@game/ConstraintsTracker";
import FogOfWarFXPipeline, { KEY_FX_FOW } from "@game/fx/FogOfWarFXPipeline";
import LevelConfigReader from "@game/config/LevelConfigReader";
import MazeInitialState from "@/game/state/MazeInitialState";
import MazeSubScene from "@game/MazeSubScene";

type MazeSceneParams = BaseSceneParams & {
    currentLevelId: number;
    levels: LevelConfig[];
};

class MazeScene extends BaseScene {

    private _params?: MazeSceneParams;
    private _levelConfigReader?: LevelConfigReader;
    private _mazeSubScene?: MazeSubScene;
    private _constraintsTracker?: ConstraintsTracker;

    // UI.
    private _timerText?: Phaser.GameObjects.BitmapText;
    private _movesLeftText?: Phaser.GameObjects.BitmapText;
    private _scoreText?: Phaser.GameObjects.BitmapText;

    // State.
    private _currentScore?: number;

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
        const currentLevel = data.levels.find(l => l.id == data.currentLevelId);
        this._levelConfigReader = LevelConfigReader.create(currentLevel!);
        this._params = data;
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
        this.sound.play("levelstart", { volume: 0.1 });

        const backgroundMusic = this.sound.add("night", { volume: 0.03 });
        backgroundMusic.loop = true;
        backgroundMusic.play();

        const { width, height } = this.game.scale;
        const [paddingLeft, paddingTop, paddingRight, paddingBottom] = [0, 2 * this._defaultTileSize, 0, 0];
        const [mazeWidth, mazeHeight] = [width - paddingLeft - paddingRight, height - paddingTop - paddingBottom];

        // Maze level config background.
        const background = this._levelConfigReader?.background();
        if (background) {
            this.add.rectangle(0, 0,
                this.game.scale.displaySize.width,
                this.game.scale.displaySize.height,
                background);
        }

        const fowFXPipeline = this.cameras.main.getPostPipeline(KEY_FX_FOW);
        if (fowFXPipeline && !(Array.isArray(fowFXPipeline) && fowFXPipeline.length == 0)) {
            (fowFXPipeline as FogOfWarFXPipeline).setPaddings(paddingLeft, paddingTop, paddingRight, paddingBottom);
        }

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

        // State.
        this._currentScore = 0;

        // UI.
        const uiElementsSafePadding = 8;
        this._scoreText = this.add.bitmapText(uiElementsSafePadding, this._defaultTileSize / 2, "bitpotion", "Score: 0", 7)
            .setCenterAlign()
            .setOrigin(0, 0.5);
        this.add.bitmapText(width - uiElementsSafePadding, this._defaultTileSize / 2, "bitpotion", `Level: ${this._levelConfigReader?.getId()}`, 7)
            .setRightAlign()
            .setAlpha(0.7)
            .setOrigin(1.0, 0.5);
        this.add.bitmapText(width - uiElementsSafePadding, this._defaultTileSize * 3 / 2, "bitpotion", this._levelConfigReader?.getTitle(), 7)
            .setRightAlign()
            .setAlpha(0.7)
            .setOrigin(1.0, 0.5);

        // Constraints.
        const constraints = this._levelConfigReader?.getLevelConstraints();
        this._constraintsTracker = new ConstraintsTracker(constraints);

        if (this._constraintsTracker.hasTimeConstraint()) {
            this._timerText = this.add.bitmapText(width / 2, this._defaultTileSize, "bitpotion", "", 7)
                .setCenterAlign()
                .setOrigin(0.5, 0.5);
        }

        if (this._constraintsTracker.hasMovesConstraint()) {
            this._movesLeftText = this.add.bitmapText(uiElementsSafePadding, this._defaultTileSize * 3 / 2, "bitpotion", "", 7)
                .setCenterAlign()
                .setOrigin(0, 0.5);
        }

        this._constraintsTracker.setOnFlagReadyListener(() => {
            this._mazeSubScene?.placeFlag();
        });

        this._constraintsTracker.setOnTimeLeftListener((time, isTimeUp) => {
            this._timerText?.setText(time);
            if (isTimeUp) {
                this._timerText!.tint = 0xff0000;
                this.sound.play("timeup");
            }
        });

        this._constraintsTracker.setOnMovesLeftListener(moves => {
            this._movesLeftText?.setText(`Moves: ${moves.toString().padStart(2, "0")}`);
        });

        this._constraintsTracker.setOnGameOverListener(this._onGameOverListener);
    }

    update(timeMs: number, dtMs: number) {
        this._mazeSubScene?.update(timeMs);
        this._constraintsTracker?.update(dtMs);
    }

    private _onMovedListener() {
        this._constraintsTracker?.movePlayer();
        this.sound.play("walk", { volume: 0.8 });
    }

    private _onScoreListener(score: number) {
        if (this._currentScore !== undefined) {
            this._currentScore += score;
            this._scoreText?.setText(`Score: ${this._currentScore}`);
        }
        this._constraintsTracker?.addScore(score);
        this.sound.play("pickup");
    }

    private _onReachedFinishListener() {
        const nextLevelId = this._levelConfigReader?.getNextLevelId();
        if (nextLevelId) {
            this.game.scene.start("MazeScene", {
                ...this._params,
                currentLevelId: nextLevelId,
            });
        }
    }

    private _onGameOverListener() {
        this.sound.play("gameover", { volume: 0.1 });
        this.sound.stopByKey("night");
        this.scene.stop();
    }
};

export default MazeScene;
export type { MazeSceneParams };
