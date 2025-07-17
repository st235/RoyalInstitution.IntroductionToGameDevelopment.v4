import Phaser from "phaser";

import CrtTvFxPipeline from "@game/CrtTvFxPipeline";
import Flag from "@game/Flag";
import Maze from "@game/Maze";
import Player from "@game/Player";
import PlayerController from "@game/PlayerController";

class MazeScene extends Phaser.Scene {

    private _flag?: Flag;
    private _maze?: Maze;
    private _player?: Player;
    private _playerController?: PlayerController;

    private _tilemap?: Phaser.Tilemaps.Tilemap;
    private _coins?: Phaser.Physics.Arcade.StaticGroup;
    private _keys?: Phaser.Physics.Arcade.StaticGroup;

    constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);

        this._onConsumeCoin = this._onConsumeCoin.bind(this);
        this._onKeyCollected = this._onKeyCollected.bind(this);
        this._onFinishReached = this._onFinishReached.bind(this);
    }

    preload() {
        this.load.setBaseURL(import.meta.env.BASE_URL);

        this.load.image("tileset-main", "tileset-colour.png");

        this.load.spritesheet("elements", "tileset-colour.png", { frameWidth: 10, frameHeight: 10 });
        this.load.spritesheet("characters", "characters-colour.png", { frameWidth: 10, frameHeight: 10 });
        this.load.spritesheet("gems", "gems-colour.png", { frameWidth: 10, frameHeight: 10 });
        this.load.spritesheet("tools", "tools-colour.png", { frameWidth: 10, frameHeight: 10 });
    }

    create() {
        const { width, height } = this.game.scale;
        this.cameras.main.setBounds(0, 0, width, height);

        (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines
            .addPostPipeline("crt", CrtTvFxPipeline);
        this.cameras.main.setPostPipeline("crt");

        // this.add.rectangle(0, 0, 2 * this.game.scale.width, 2 * this.game.scale.height, 0xfffffff);


        const levelBackground = [
            [ 0,  0,  34,  34,  34,  34,  34,  34,  34,  34,  34 ],
            [ 34,   1,   2,   3,  34,  34,  34,   1,   2,   3,  34 ],
            [ 34,   5,   6,   7,  34,  34,  34,   5,   6,   7,  34 ],
            [ 34,  34,  34,  34,  34,  34,  34,  34,  34,  34,  34 ],
            [ 34,  34,  34,  14,  13,  14,  34,  34,  34,  34,  34 ],
            [ 34,  34,  34,  34,  34,  34,  34,  34,  34,  34,  34 ],
            [ 34,  34,  34,  34,  34,  34,  34,  34,  34,  34,  34 ],
            [ 34,  34,  14,  14,  14,  14,  14,  34,  34,  34,  15 ],
            [ 34,  34,  34,  34,  34,  34,  34,  34,  34,  15,  15 ],
            [ 35,  36,  37,  34,  34,  34,  34,  34,  15,  15,  15 ],
            [ 39,  39,  39,  39,  39,  39,  39,  39,  39,  39,  39 ]
        ];

        this._maze = Maze.fromConfig(`
            W0 W0 W0 W1 W1 W2 . W2
            W1 .  SP  .  W3 .  . W4
            W6 .  D0 .  .  SP  . w7
            W6 .  .  .  .  .  C1 w7
            W6 .  SP .  D0  .  . w7
            W6 .  .  .  .  .  . w7
            W6 C0  .  K0  .  F0  . w7
            . .  .  F1  .  .  . w7 
            W0 W0 W0 W1 W1 W2 W2 W2
            W0 W0 W0 W1 W1 W2 W2 W2
        `);

        const levelWalls = this._maze!.getWallsLayer();

        this._tilemap = this.make.tilemap({ 
            tileWidth: 10,
            tileHeight: 10,
            width: this.game.scale.width,
            height: this.game.scale.height,
        });

        const mainTileset = this._tilemap.addTilesetImage("tileset-main");

        const backgroundLayer = this._tilemap.createBlankLayer("Background", mainTileset!);
        const foregroundLayer = this._tilemap.createBlankLayer("Foreground", mainTileset!);

        backgroundLayer?.putTilesAt(levelBackground, 0, 0);
        foregroundLayer?.putTilesAt(levelWalls, 0, 0);
        foregroundLayer?.forEachTile(tile => {
            if (tile.index != -1) {
                tile.properties.collides = true;
            }
        });

        // Start point.
        const [startI, startJ] = this._maze!.getStartPoint();
        const startCoordinates = this._tilemap.tileToWorldXY(startJ, startI);
        this._player = Player.add(this, "characters", this._maze!.getCharacterTile(), 10, 10, startCoordinates!.x, startCoordinates!.y);
        this._playerController = PlayerController.wrap(this, this._player);

        // Finish point.
        const [finishI, finishJ, flagVariation] = this._maze!.getFinishPoint();
        const finishCoordinates = this._tilemap.tileToWorldXY(finishJ, finishI);
        this._flag = Flag.add(this, "elements", this._maze!.getFlagTile(flagVariation), 10, 10, finishCoordinates!.x, finishCoordinates!.y);

        // Coins.
        const coinsLayer = this._maze?.getCoins();
        this._coins = this.physics.add.staticGroup();

        coinsLayer?.forEach(point => {
            const [i, j, v] = point;

            const position = this._tilemap?.tileToWorldXY(j, i);
            const tile = this._maze?.getCoinTile(v);

            const obj = this._coins?.create(position!.x, position!.y, "gems", tile);
            obj.setOrigin(0, 0);
            obj.refreshBody();

            obj.setDataEnabled();
            obj.data.set("variation", v);
        });

        // Keys.
        const keysLayer = this._maze?.getKeys();
        this._keys = this.physics.add.staticGroup();

        keysLayer?.forEach(point => {
            const [i, j, v] = point;

            const position = this._tilemap?.tileToWorldXY(j, i);
            const tile = this._maze?.getKeyTile(v);

            const obj = this._keys?.create(position!.x, position!.y, "tools", tile);
            obj.setOrigin(0, 0);
            obj.refreshBody();

            obj.setDataEnabled();
            obj.data.set("variation", v);
        });

        // Ordering.
        backgroundLayer?.setDepth(0);
        this._player?.setDepth(1);
        foregroundLayer?.setDepth(2);
    }

    update() {
        const player = this._player!;

        this._playerController?.handleInput(position => {
            const tilemap = this._tilemap!;
            const tile = tilemap.getTileAtWorldXY(position[0], position[1]);
            return tile?.properties.collides !== true;
        });

        this.physics.overlap(player, this._flag, this._onFinishReached as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
        this.physics.overlap(player, this._coins, this._onConsumeCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
        this.physics.overlap(player, this._keys, this._onKeyCollected as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
    }

    private _onConsumeCoin(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        coin: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        const variation: number = coin.data.get("variation");
        const score = this._maze!.getCoinScore(variation);

        console.log(score);

        coin.destroy(true);
    }

    private _onKeyCollected(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        key: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        const variation: number = key.data.get("variation");
        const doorsToOpen = this._maze?.openDoors(variation) ?? [];

        for (const door of doorsToOpen) {
            const [i, j, v] = door;
            const openDoorTile = this._maze!.getOpenDoorTile(v);
            this._tilemap?.removeTileAt(j, i, true, true, "Foreground");
            this._tilemap?.putTileAt(openDoorTile, j, i, true, "Foreground");
        }

        key.destroy(true);
    }

    private _onFinishReached(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        flag: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        flag.destroy(true);
    }
};

export default MazeScene;
