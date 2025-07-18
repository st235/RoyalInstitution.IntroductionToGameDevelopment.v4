import Phaser from "phaser";

import Flag from "@game/Flag";
import MazeInitialState from "@/game/state/MazeInitialState";
import Monster from "@game/Monster";
import Player from "@game/Player";
import PlayerController from "@game/PlayerController";

const _KEY_TILEMAP_LAYER_BACKGROUND = "Background";
const _KEY_TILEMAP_LAYER_FOREGROUND = "Foreground";

type OnMovedListener = () => void;
type OnScoreListener = (score: number) => void;
type OnReachedFinishListener = () => void;
type OnGameOverListener = () => void;

class MazeSubScene {

    private readonly _scene: Phaser.Scene;
    private readonly _mazeInitialState: MazeInitialState;
    private readonly _tileSize: number;
    private readonly _width: number;
    private readonly _height: number;
    private readonly _x: number;
    private readonly _y: number;

    private readonly _player: Player;
    private readonly _playerController: PlayerController;

    private _flag?: Flag;

    private readonly _tilemap: Phaser.Tilemaps.Tilemap;
    private readonly _coins: Phaser.Physics.Arcade.StaticGroup;
    private readonly _keys: Phaser.Physics.Arcade.StaticGroup;
    private readonly _monsters: Phaser.Physics.Arcade.Group;

    private _onMovedListener?: OnMovedListener;
    private _onScoreListener?: OnScoreListener;
    private _onReachedFinishListener?: OnReachedFinishListener;
    private _onGameOverListener?: OnGameOverListener;

    constructor(scene: Phaser.Scene, mazeInitialState: MazeInitialState,
        tileSize: number, x: number, y: number, width: number, height: number) {

        // Constructor area.
        this._scene = scene;
        this._mazeInitialState = mazeInitialState;
        this._tileSize = tileSize;
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;

        // Bindings.
        this._onKeyCollected = this._onKeyCollected.bind(this);
        this._onConsumeCoin = this._onConsumeCoin.bind(this);
        this._onFinishReached = this._onFinishReached.bind(this);
        this._onMonsterCollapsed = this._onMonsterCollapsed.bind(this);

        // Children creation.
        const mazeWallsLayer = this._mazeInitialState.getWallsLayer();

        this._tilemap = this._scene.make.tilemap({ 
            tileWidth: this._tileSize,
            tileHeight: this._tileSize,
            width: this._width,
            height: this._height,
        });

        const mainTileset = this._tilemap.addTilesetImage("tileset-main")!;
        mainTileset.tileOffset = new Phaser.Math.Vector2(-this._x, -this._y);

        const backgroundTilemapLayer = this._tilemap.createBlankLayer(_KEY_TILEMAP_LAYER_BACKGROUND, mainTileset)!;
        const foregroundTilemapLayer = this._tilemap.createBlankLayer(_KEY_TILEMAP_LAYER_FOREGROUND, mainTileset)!;

        backgroundTilemapLayer.putTilesAt(mazeWallsLayer, 0, 0);
        backgroundTilemapLayer.forEachTile(tile => {
            if (this._mazeInitialState?.doesCollideAt(tile.y, tile.x)) {
                tile.properties.collides = true;
            }
        });

        // Start point.
        const [startI, startJ] = this._mazeInitialState.getStartPoint();
        const [startX, startY] = this._tileToWorldXY(startJ, startI);
        this._player = Player.add(this._scene, "characters", this._mazeInitialState.getCharacterTile(),
            this._tileSize, this._tileSize, startX, startY);
        this._playerController = PlayerController.wrap(this._scene, this._player,
            () => this._onMovedListener?.());

        // Coins.
        const coinsLayer = this._mazeInitialState?.getCoins();
        this._coins = this._scene.physics.add.staticGroup();

        coinsLayer?.forEach(point => {
            const [i, j, v] = point;
            const [x, y] = this._tileToWorldXY(j, i);

            const tile = this._mazeInitialState?.getCoinTile(v);

            const obj = this._coins.create(x, y, "gems", tile);
            obj.setOrigin(0, 0);
            obj.refreshBody();

            obj.setDataEnabled();
            obj.data.set("variation", v);
        });

        // Keys.
        const keysLayer = this._mazeInitialState?.getKeys();
        this._keys = this._scene.physics.add.staticGroup();

        keysLayer?.forEach(point => {
            const [i, j, v] = point;
            const [x, y] = this._tileToWorldXY(j, i);

            const tile = this._mazeInitialState?.getKeyTile(v);

            const obj = this._keys.create(x, y, "tools", tile);
            obj.setOrigin(0, 0);
            obj.refreshBody();

            obj.setDataEnabled();
            obj.data.set("variation", v);
        });

        // Monsters.
        const monstersLayer = this._mazeInitialState?.getMonsters();
        this._monsters = this._scene.physics.add.group();

        monstersLayer?.forEach(point => {
            const [i, j, v] = point;
            const [x, y] = this._tileToWorldXY(j, i);

            const tile = this._mazeInitialState?.getMonsterTile(v!);

            const monster = Monster.add(this._scene, this._monsters!, "creatures", tile!, this._tileSize, this._tileSize, x, y);
            monster.setPath(this._mazeInitialState.getMonsterPath(v!), this._mazeInitialState.getMonsterUpdateTimeMs(v!));
        });


        // Ordering.
        this._coins.setDepth(0);
        this._keys.setDepth(1);
        this._monsters.setDepth(2);
        backgroundTilemapLayer.setDepth(3);
        this._player.setDepth(4);
        foregroundTilemapLayer.setDepth(5);
    }

    update(timeMs: number) {
        const player = this._player!;

        this._playerController?.handleInput(position => {
            const tile = this._getTileAtWorldXY(position[0], position[1], _KEY_TILEMAP_LAYER_BACKGROUND);
            return tile?.properties.collides !== true;
        });

        this._monsters.children.each(monster => {
            monster.update(timeMs);
            return true;
        });

        this._scene.physics.overlap(player, this._flag, this._onFinishReached as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
        this._scene.physics.overlap(player, this._coins, this._onConsumeCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
        this._scene.physics.overlap(player, this._keys, this._onKeyCollected as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
        this._scene.physics.overlap(player, this._monsters, this._onMonsterCollapsed as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback);
    }

    setOnMovedListener(onMovedListener?: OnMovedListener) {
        this._onMovedListener = onMovedListener;
    }

    setOnScoreListener(onScoreListener?: OnScoreListener) {
        this._onScoreListener = onScoreListener;
    }

    setOnReachedFinishListener(onReachedFinishListener?: OnReachedFinishListener) {
        this._onReachedFinishListener = onReachedFinishListener;
    }

    setOnGameOverListener(onGameOverListener?: OnGameOverListener) {
        this._onGameOverListener = onGameOverListener;
    }

    placeFlag() {
        const [finishI, finishJ, flagVariation] = this._mazeInitialState.getFinishPoint();
        const [finishX, finishY] = this._tileToWorldXY(finishJ, finishI);
        this._flag = Flag.add(this._scene, "elements", this._mazeInitialState.getFlagTile(flagVariation),
            this._tileSize, this._tileSize, finishX, finishY);
    }

    private _onKeyCollected(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        key: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        const variation: number = key.data.get("variation");
        const doorsToOpen = this._mazeInitialState?.openDoors(variation) ?? [];

        for (const door of doorsToOpen) {
            const [i, j, v] = door;
            const openDoorTile = this._mazeInitialState.getOpenDoorTile(v);
            this._tilemap.removeTileAt(j, i, true, true, _KEY_TILEMAP_LAYER_BACKGROUND);
            this._tilemap.putTileAt(openDoorTile, j, i, true, _KEY_TILEMAP_LAYER_FOREGROUND);
        }

        key.destroy(true);
    }

    private _onConsumeCoin(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        coin: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        const variation: number = coin.data.get("variation");
        const score = this._mazeInitialState.getCoinScore(variation);
        coin.destroy(true);

        this._onScoreListener?.(score);
    }

    private _onFinishReached(_player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        flag: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        flag.destroy(true);

        this._onReachedFinishListener?.();
    }

    private _onMonsterCollapsed(player: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        player.destroy();

        this._onGameOverListener?.();
    }

    private _tileToWorldXY(i: number, j: number, layer?: string): [number, number] {
        const worldCoordinates = this._tilemap.tileToWorldXY(i, j, undefined, undefined, layer);
        if (!worldCoordinates) {
            throw new Error("Coordinates cannot be null");
        }
        return [this._x + worldCoordinates.x, this._y + worldCoordinates.y];
    }

    private _getTileAtWorldXY(x: number, y: number, layer?: string): Phaser.Tilemaps.Tile | null {
        const tile = this._tilemap.getTileAtWorldXY(x - this._x, y - this._y, false, undefined, layer);
        return tile;
    }
};

export default MazeSubScene;
