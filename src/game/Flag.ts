import Phaser from "phaser";

class Flag extends Phaser.GameObjects.Container {

    private readonly _child: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene,
        texture: string, frame: number,
        width: number, height: number,
        x: number, y: number) {
        super(scene, x + width / 2, y + height / 2);
        this._child = new Phaser.GameObjects.Image(scene, 0, 0, texture, frame);
        this.add(this._child);
        this.setSize(width, height);
    }

    public static add(scene: Phaser.Scene,
        texture: string, frame: number,
        width: number, height: number,
        x: number, y: number): Flag {
        const flag = new Flag(scene, texture, frame, width, height, x, y);
        scene.add.existing(flag);
        scene.physics.add.existing(flag);
        return flag;
    }
};

export default Flag;
