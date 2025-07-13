import Phaser from "phaser";

const defaultConfig = {
    type: Phaser.AUTO,
    parent: "game-container",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0, },
        },
    }
};

const LaunchScene = <T extends Phaser.Types.Scenes.SceneType>(
    parent: HTMLElement | string,
    scene: T,
    width: number,
    height: number,
): Phaser.Game => {
    return new Phaser.Game({
        ...defaultConfig,
        width,
        height,
        parent,
        scene: scene,
    });
};

export { LaunchScene };
