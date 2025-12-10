import BaseScene from "@/game/scenes/BaseScene";

const defaultBackgroundTiles = [
    [  100,   61,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,  607,  641,  641,  641,  641,  641,  641,  641,  641],
    [  100,    0,    0,    0,    0,   63,    0,    0,    0,    0,    0,    0,    0,  707,  673,  673,  674,  641,  641,  641,  641,  641],
    [    0,    0,    0,    0,    0,    0,    0,    0,  292,  291,  292,  292,    0,    0,    0,    0,  607,  641,  641,  641,  641,  641],
    [    0,    0,    0,    0,  125,    0,    0,    0,    0,  294,  295,  294,    0,    0,    0,    0,  607,  641,  641,  641,  641,  641],
    [    0,   59,    0,    0,   59,    0,  559,    0,  301,  294,  294,  294,    0,    0,    0,    0,  607,  673,  673,  673,  674,  641],
    [    0,    0,    0,    0,    0,    0,    0,    0,  119,  119,  119,  119,  681,    0,    0,    0,  500,    0,    0,    0,  607,  641],
    [   59,    0,   60,    0,    0,    0,   62,    0,    0,    0,    0,    0,    0,    0,    0,    0,  533,    0,    0,    0,  607,  641],
    [    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,  500,    0,    0,    0,  607,  641],
    [ 1031, 1031, 1031, 1031, 1031,   34,   34,   67, 1031, 1031, 1031, 1031, 1031, 1031, 1034,    0,  533,    0,    0,    0,  607,  641],
    [    0,    0,    0,    0,    0,    0,   97,    0,    0,    0,    0,    0,    0,   34, 1067,    0,  533,    0,    0,    0,  672,  673],
    [    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,  268,    0,    0,    0, 1067,    0,  533,  284,    0,    0,   34,   34],
    [    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0, 1030, 1031, 1031, 1100,   67,  115,   67,   67,   67,   67,   67],
    [    0,    0,    0,  267,    0,    0,    0,    0,    0,  460,    0, 1129,    0,    0,    0,    0,  500,    0,    0,   34,   34,   34],
    [    0,  166,  266,   34,    0,    0,    0,    0,    0,    0,    0, 1129,    0,  629,  563,  562,  567,    0,    0,    0,    0,    0],
    [  585,    0,    0,    0,    0,    0,  166,  100,  166,    0,    0, 1129,    0,  533,  591,    0,    0,    0,    0,    0,    0,    0],
    [  133,  583,    0,   61,    0,    0,  166,  166,  100,    0,    0,  133,    0,  533,    0,    0,    0,    0,    0,   63,    0,  298],
    [  681,  265,    0,    0,    0,    0,  166,  166,  166,    0,  267,  166,    0,  500,    0,  193,  193,    0,    0,    0,  199,  298],
    [  100,  683,    0,    0,    0,    0,    0,    0,    0,  266,    0,  166,    0,  533,    0,    0,    0,    0,    0,    0,  232,  331],
];

class StartScene extends BaseScene {

    private _params?: object;

    constructor() {
        super({
            key: "StartScene",
        });
    }

    init(data: object) {
        super.init(data);
        this._params = data;
    }

    preload() {
        this.load.setBaseURL(import.meta.env.BASE_URL);

        let filesColourSuffix = "";
        if (this._gameConfigReader?.isUsingColourTiles()) {
            filesColourSuffix = "-colour";
        }

        this.load.image("tileset-main", `tileset${filesColourSuffix}.png`);
        this.load.image("particle", "particle.png");

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
        this.load.audio("select", ["select.wav"]);
    }

    create() {
        super.create();

        this.add.rectangle(0, 0,
            this.game.scale.width,
            this.game.scale.height,
            0x212121)
            .setOrigin(0, 0);

        const tilemap = this.make.tilemap({
            data: defaultBackgroundTiles,
            tileWidth: this._defaultTileSize,
            tileHeight: this._defaultTileSize,
            width: this.game.scale.width,
            height: this.game.scale.width,
        });

        const mainTileset = tilemap.addTilesetImage("tileset-main")!;
        const layer = tilemap.createLayer(0, mainTileset, 0, 0)!;

        layer.setAlpha(0.5);

        this.add.bitmapText(this.game.scale.width / 2, this.game.scale.height / 2,
            "bitpotion", "Legend of Royal Institution", 9)
            .setCenterAlign()
            .setOrigin(0.5, 0.5);

        const pressEnterText = this.add.bitmapText(this.game.scale.width / 2, this.game.scale.height / 2 + 20,
            "bitpotion", "Click anywhere to start", 7)
            .setCenterAlign()
            .setAlpha(0.7)
            .setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: pressEnterText,
            alpha:    0,
            ease: "Cubic.easeOut",
            duration: 1000,
            repeat: -1,
            yoyo: true
        });

        this.input.on("pointerdown",  this._onStartGame, this);
        this.input.keyboard?.on("keydown-ENTER", this._onStartGame, this);
    }

    private _onStartGame() {
        this.scene.start("TextDialogScene", {
            ...this._params,
            message: {
                text: this._gameConfigReader?.getMessageOverwrites()?.intro ?? "What?!\nA placeholder text?!!!\nNarrative!",
                height: this._gameConfigReader?.getMessageOverwrites()?.introHeight,
                character: this._gameConfigReader?.getMessageOverwrites()?.character ?? 0,
            },
            nextSceneKey: "MazeScene",
        });
        this.sound.play("select", { volume: 0.5 });
    }
}

export default StartScene;
