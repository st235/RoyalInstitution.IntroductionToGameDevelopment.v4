import "@components/phaser/PhaserGameContainer.css";

import Phaser from "phaser";
import React, { useEffect, useRef } from "react";

import { EventBus } from "@components/phaser/EventBus";
import { LaunchScene } from "@components/phaser/LaunchScene";
import { useDeepCompareLayoutEffect } from "@/hooks/useDeepEffects";

type PhaserScenesType = Phaser.Types.Scenes.SceneType | Phaser.Types.Scenes.SceneType[];

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
        data?: object;
    };
    scenes: PhaserScenesType;
    containerRef: React.RefObject<PhaserGameContainerRef>;
    onNewScene?: (scene: Phaser.Scene) => void;
};

function PhaserGameContainer(props: PhaserGameContainerProps) {
    const ref = props.containerRef;

    const gameRef = useRef<Phaser.Game>(null);

    useDeepCompareLayoutEffect(() => {
        if (!gameRef.current) {
            gameRef.current = LaunchScene(
                "game-canvas",
                props.scenes,
                props.viewport.width,
                props.viewport.height,
            );
            gameRef.current.scene.start(props.launch.key, props.launch.data);

            if (ref !== null) {
                ref.current = { game: gameRef.current, activeScene: null };
            }
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true, false);
                gameRef.current = null;
            }
        };
    }, [ref, gameRef, props.scenes, props.launch.data, props.viewport.width, props.viewport.height, props.launch.key]);

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
    }, [props, ref]);

    return (
        <div id="game-container" />
    );
}

export default PhaserGameContainer;
export type { PhaserGameContainerRef, PhaserGameContainerProps };
