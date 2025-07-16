import Phaser from "phaser";

class Player extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene,
        texture: string, frame: number,
        width: number, height: number,
        x: number, y: number) {
        super(scene, x + width / 2, y + height / 2);
        this.add(new Phaser.GameObjects.Image(scene, 0, 0, texture, frame));
        this.setSize(width, height);
    }

    public goLeft() {
        this._move(-this.width, 0);
        this.scaleX = -1;
    }

    public goUp() {
        this._move(0, -this.height);
    }

    public goRight() {
        this._move(this.width, 0);
        this.scaleX = 1;
    }

    public goDown() {
        this._move(0, this.height);
    }

    public getFacingPoint(direction: [number, number]): [number, number] {
        return [this.x + this.width * direction[0], this.y + this.height * direction[1]];
    }

    private _move(dx: number = 0, dy: number = 0) {
        this.x += dx;
        this.y += dy;
    }

    public static add(scene: Phaser.Scene,
        texture: string, frame: number,
        width: number, height: number,
        x: number, y: number): Player {
        const player = new Player(scene, texture, frame, width, height, x, y);
        scene.add.existing(player);
        return player;
    }
};

export default Player;
