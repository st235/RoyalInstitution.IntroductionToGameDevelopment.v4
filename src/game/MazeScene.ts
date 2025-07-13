import Phaser from "phaser";

class MazeScene extends Phaser.Scene {

    preload() {
        this.load.setBaseURL(import.meta.env.BASE_URL);
        this.load.image("tileset", "tileset-colour.png");
    }

    create() {
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

        const levelForeground = [
            [ 340,  340,  340,  340,  340,  340,  340,  340,  340,  340,  340 ],
            [ -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1 ],
        ];

        const map = this.make.tilemap({ tileWidth: 10, tileHeight: 10 });
        const tileset = map.addTilesetImage("tileset");

        if (tileset) {
            const backgroundLayer = map.createBlankLayer("Background", tileset);
            const foregroundLayer = map.createBlankLayer("Foreground", tileset);

            backgroundLayer?.putTilesAt(levelBackground, 0, 0);
            backgroundLayer?.setScale(4, 4);

            foregroundLayer?.putTilesAt(levelForeground, 0, 0);
            foregroundLayer?.setScale(4, 4);

            const debugGraphics = this.add.graphics().setAlpha(0.75);
            foregroundLayer?.renderDebug(debugGraphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
            foregroundLayer?.setCollision(340, false);
        }
    }

};

export default MazeScene;
