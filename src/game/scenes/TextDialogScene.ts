import Phaser from "phaser";

import type { MazeSceneParams } from "@game/scenes/MazeScene";

import BaseScene from "@/game/scenes/BaseScene";

type DialogInfo = {
    text: string;
    character?: number;
    height: number;
};

type TextDialogSceneParams = MazeSceneParams & {
    message: DialogInfo;
    nextSceneKey: string;
};

class TextDialogScene extends BaseScene {

    private _params?: TextDialogSceneParams;
    private _dialogInfo?: DialogInfo;

    constructor() {
        super({
            key: "TextDialogScene",
        });
    }

    init(data: TextDialogSceneParams) {
        super.init(data);
        this._params = data;
        this._dialogInfo = data.message;
    }

    create() {
        super.create();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [paddingLeft, _paddingTop, paddingRight, paddingBottom] = [10, 10, 10, 30];

        this.add.rectangle(paddingLeft, this.game.scale.height - paddingBottom,
            this.game.scale.width - paddingLeft - paddingRight,
            this._dialogInfo!.height, 0x000000, 0.0)
            .setStrokeStyle(4, 0xffffff)
            .setOrigin(0, 1);

        let characterOffset = 10;

        if (this._dialogInfo?.character !== undefined) {
            this.add.image(paddingLeft, this.game.scale.height - this._dialogInfo!.height / 2 - paddingBottom - 4, "characters", this._dialogInfo.character)
                .setScale(5)
                .setOrigin(0, 0.5);
            characterOffset += 55;
        }

        this.add.bitmapText(paddingLeft + characterOffset, this.game.scale.height - this._dialogInfo!.height - paddingBottom + 2,
            "bitpotion", this._dialogInfo!.text, 9)
            .setLeftAlign()
            .setOrigin(0, 0);

        const pressEnterText = this.add.bitmapText(this.game.scale.width / 2, this.game.scale.height - 12,
            "bitpotion", "Click anywhere to continue", 7)
            .setCenterAlign()
            .setAlpha(0.7)
            .setOrigin(0.5, 1.0);

        this.tweens.add({
            targets: pressEnterText,
            alpha: 0,
            ease: "Cubic.easeOut",
            duration: 1000,
            repeat: -1,
            yoyo: true
        });

        this.input.on("pointerdown",  this._onStartGame, this);
        this.input.keyboard?.on("keydown-ENTER", this._onStartGame, this);
    }

    private _onStartGame() {
        this.sound.play("select", { volume: 0.5 });
        this.scene.start(this._params?.nextSceneKey, {
            ...this._params,
            message: undefined,
            nextSceneKey: undefined,
        });
    }
}

export default TextDialogScene;
