import Phaser from "phaser";

const defaultConfig = {
    type: Phaser.AUTO,
    render: {
        antialiasGL: false,
        pixelArt: true,
        autoResize: false,
    },
    scale: {
        parent: "game-container",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
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
