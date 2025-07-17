import Phaser from "phaser";

const defaultUpdateTimeMs = 1000;

class Monster extends Phaser.GameObjects.Container {

    private readonly _child: Phaser.GameObjects.Image;

    private _path: [number, number][];
    private _currentPathIndex: number;
    private _updateTimeMs: number;
    private _lastUpdateTimeMs: number;

    constructor(scene: Phaser.Scene,
        texture: string, frame: number,
        width: number, height: number,
        x: number, y: number) {
        super(scene, x + width / 2, y + height / 2);

        this._child = new Phaser.GameObjects.Image(scene, 0, 0, texture, frame);
        this._path = [];
        this._currentPathIndex = 0;
        this._updateTimeMs = defaultUpdateTimeMs;
        this._lastUpdateTimeMs = -1;

        this.add(this._child);
        this.setSize(width, height);
    }

    setPath(path: [number, number][], updateTimeMs: number) {
        this._path = path;
        this._currentPathIndex = 0;
        this._updateTimeMs = updateTimeMs;
        this._lastUpdateTimeMs = -1;
    }

    update(timeMs: number) {
        if (timeMs - this._lastUpdateTimeMs >= this._updateTimeMs &&
            this._currentPathIndex < this._path.length) {
            this._lastUpdateTimeMs = timeMs;
            const [di, dj] = this._path[this._currentPathIndex];
            this._currentPathIndex = (this._currentPathIndex + 1) % this._path.length;
            this.setPosition(this.x + dj * this.width, this.y + di * this.height);
        }
    }

    public static add(scene: Phaser.Scene, group: Phaser.Physics.Arcade.Group,
        texture: string, frame: number,
        width: number, height: number,
        x: number, y: number): Monster {
        const monster = new Monster(scene, texture, frame, width, height, x, y);
        group.add(monster, true);
        return monster;
    }
};

export default Monster;
