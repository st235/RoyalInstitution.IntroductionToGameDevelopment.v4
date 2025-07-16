import Phaser from "phaser";

import Maze from "@game/Maze";
import Player from "@game/Player";
import PlayerController from "@game/PlayerController";

class MazeScene extends Phaser.Scene {

    private _maze?: Maze;
    private _player?: Player;
    private _playerController?: PlayerController;

    private _tilemap?: Phaser.Tilemaps.Tilemap;

    preload() {
        this.load.setBaseURL(import.meta.env.BASE_URL);
        this.load.image("tileset", "tileset-colour.png");
        this.load.spritesheet("characters", "characters.png", { frameWidth: 10, frameHeight: 10 });
    }

    create() {
        const { width, height } = this.game.scale;
        this.cameras.main.setBounds(0, 0, width, height);

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
            W1 .  .  .  W3 .  . W4
            W6 .  . .  .  SP  . w7
            W6 .  .  .  .  .  . w7
            W6 .  SP .  .  .  . w7
            W6 .  .  .  .  .  . w7
            W6 .  .  .  .  .  . w7
            . .  .  .  .  .  . w7 
            W0 W0 W0 W1 W1 W2 W2 W2
            W0 W0 W0 W1 W1 W2 W2 W2
        `);

        const levelForeground = this._maze!.getWallsLayer();

        this._tilemap = this.make.tilemap({ 
            tileWidth: 10,
            tileHeight: 10,
            width: this.game.scale.width,
            height: this.game.scale.height,
        });
        const tileset = this._tilemap.addTilesetImage("tileset");

        if (tileset) {
            const backgroundLayer = this._tilemap.createBlankLayer("Background", tileset);
            const foregroundLayer = this._tilemap.createBlankLayer("Foreground", tileset);

            backgroundLayer?.putTilesAt(levelBackground, 0, 0);
            foregroundLayer?.putTilesAt(levelForeground, 0, 0);

            foregroundLayer?.forEachTile(tile => {
                if (tile.index != -1) {
                    tile.properties.collides = true;
                }
            });
        }

        const startPosition = this._maze!.getStartPosition();
        const startCoordinates = this._tilemap.tileToWorldXY(startPosition[1], startPosition[0]);
        this._player = Player.add(this, "characters", 0, 10, 10, startCoordinates!.x, startCoordinates!.y);
        this._playerController = PlayerController.wrap(this, this._player);
    }

    update() {
        this._playerController?.handleInput(position => {
            const tilemap = this._tilemap!;
            const tile = tilemap.getTileAtWorldXY(position[0], position[1]);
            return tile?.properties.collides !== true;
        });
    }
};

export default MazeScene;
