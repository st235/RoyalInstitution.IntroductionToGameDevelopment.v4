import "./PhaserGameContainer.css";

import Phaser from "phaser";
import React, { useEffect, useLayoutEffect, useRef } from "react";

import { EventBus } from "./EventBus";
import { LaunchScene } from "./LaunchScene";

type PhaserGameContainerRef = {
    game: Phaser.Game;
    activeScene: Phaser.Scene | null;
} | null;

type PhaserGameContainerProps = {
    viewport: {
        width: number;
        height: number;
    };
    launch: {
        key: string;
        scene: Phaser.Types.Scenes.SceneType;
    }
    containerRef: React.RefObject<PhaserGameContainerRef>;
    onNewScene?: (scene: Phaser.Scene) => void;
};

function PhaserGameContainer(props: PhaserGameContainerProps) {
    const ref = props.containerRef;

    const game = useRef<Phaser.Game>(null);

    useLayoutEffect(() => {
        if (!game.current) {
            game.current = LaunchScene(
                "game-canvas",
                props.launch.scene,
                props.viewport.width,
                props.viewport.height,
            );
            game.current.scene.start(props.launch.key);

            if (ref !== null) {
                ref.current = { game: game.current, activeScene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true, false);
                game.current = null;
            }
        };
    }, [ref, game]);

    useEffect(() => {
        EventBus.on("current-scene-ready", (newScene: Phaser.Scene) => {
            if (ref.current != null) {
                ref.current.activeScene = newScene;
            }
            props.onNewScene?.(newScene);
        });

        return () => {
            EventBus.removeListener("current-scene-ready");
        };
    }, [ref]);

    return (
        <div className="game-container">
            <div id="game-canvas" />
        </div>
    );
}

export default PhaserGameContainer;
export type { PhaserGameContainerRef, PhaserGameContainerProps };
