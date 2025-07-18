import Phaser from "phaser";

import type { BaseSceneParams } from "@game/BaseScene";
import type { LevelConfig } from "@game/config/LevelConfigReader";

import BaseScene from "@game/BaseScene";
import Flag from "@game/Flag";
import FogOfWarFXPipeline, { KEY_FX_FOW } from "@game/fx/FogOfWarFXPipeline";
import LevelConfigReader from "@game/config/LevelConfigReader";
import Maze from "@game/Maze";
import Monster from "@game/Monster";
import Player from "@game/Player";
import PlayerController from "@game/PlayerController";

type MazeSceneParams = BaseSceneParams & {
    levelConfig: LevelConfig;
};

class MazeScene extends BaseScene {

    private _levelConfigReader?: LevelConfigReader;

    private _flag?: Flag;
    private _maze?: Maze;
    private _player?: Player;
    private _playerController?: PlayerController;

    private _tilemap?: Phaser.Tilemaps.Tilemap;
    private _coins?: Phaser.Physics.Arcade.StaticGroup;
    private _keys?: Phaser.Physics.Arcade.StaticGroup;
    private _monsters?: Phaser.Physics.Arcade.Group;

    constructor() {
        super({
            key: "MazeScene",
        });

        this._onConsumeCoin = this._onConsumeCoin.bind(this);
        this._onKeyCollected = this._onKeyCollected.bind(this);
        this._onFinishReached = this._onFinishReached.bind(this);
        this._onMonsterCollapsed = this._onMonsterCollapsed.bind(this);
    }

    init(data: MazeSceneParams) {
        super.init(data);
        console.log(data);
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
        const { width, height } = this.game.scale;

        const background = this._levelConfigReader?.background();
        if (background) {
            this.add.rectangle(0, 0,
                this.game.scale.displaySize.width,
                this.game.scale.displaySize.height,
                background);
        }

        this._maze = Maze.fromConfig(
            [ height / 10, width / 10],
            this._levelConfigReader!.getLevelLayout(),
            this._gameConfigReader?.getCharacterConfig(),
            this._gameConfigReader?.getCoinsConfig(),
            this._gameConfigReader?.getDoorsConfig(),
            this._gameConfigReader?.getFlagsConfig(),
            this._gameConfigReader?.getGarnitureConfig(),
            this._gameConfigReader?.getMonstersConfig(),
            this._gameConfigReader?.getWallsConfig(),
        );

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

        backgroundLayer?.putTilesAt(levelWalls, 0, 0);
        backgroundLayer?.forEachTile(tile => {
            if (this._maze?.doesCollideAt(tile.y, tile.x)) {
                tile.properties.collides = true;
            }
        });

        // Start point.
        const [startI, startJ] = this._maze!.getStartPoint();
        const startCoordinates = this._tilemap.tileToWorldXY(startJ, startI);
        this._player = Player.add(this, "characters", this._maze!.getCharacterTile(), 10, 10, startCoordinates!.x, startCoordinates!.y);
        this._playerController = PlayerController.wrap(this, this._player, () => {
            console.log("Moved");
        });

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

        // Monsters.
        const monstersLayer = this._maze?.getMonsters();
        this._monsters = this.physics.add.group();

        monstersLayer?.forEach(point => {
            const [i, j, v] = point;

            const position = this._tilemap?.tileToWorldXY(j, i);
            const tile = this._maze?.getMonsterTile(v!);

            const monster = Monster.add(this, this._monsters!, "creatures", tile!, 10, 10, position!.x, position!.y);
            monster.setPath(this._maze!.getMonsterPath(v!), this._maze!.getMonsterUpdateTimeMs(v!));
        });


        // Ordering.
        this._coins?.setDepth(0);
        this._keys?.setDepth(1);
        this._monsters?.setDepth(2);
        backgroundLayer?.setDepth(3);
        this._player?.setDepth(4);
        foregroundLayer?.setDepth(5);
    }

    update(timeMs: number) {
        const player = this._player!;

        this._playerController?.handleInput(position => {
            const tilemap = this._tilemap!;
            const tile = tilemap.getTileAtWorldXY(position[0], position[1],
                false, undefined, "Background");
            return tile?.properties.collides !== true;
        });

        this._monsters?.children.each(monster => {
            monster.update(timeMs);
            return true;
        });

        this.physics.overlap(player, this._flag, this._onFinishReached as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
        this.physics.overlap(player, this._coins, this._onConsumeCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
        this.physics.overlap(player, this._keys, this._onKeyCollected as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
        this.physics.overlap(player, this._monsters, this._onMonsterCollapsed as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
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
            this._tilemap?.removeTileAt(j, i, true, true, "Background");
            this._tilemap?.putTileAt(openDoorTile, j, i, true, "Foreground");
        }

        key.destroy(true);
    }

    private _onFinishReached(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        flag: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        flag.destroy(true);
    }

    private _onMonsterCollapsed() {
        console.log("Ate by monster.");
    }
};

export default MazeScene;
export type { MazeSceneParams };
