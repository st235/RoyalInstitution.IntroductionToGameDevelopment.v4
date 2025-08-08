import "@components/phaser/PhaserGameContainer.css";

import Phaser from "phaser";
import React, { useEffect, useLayoutEffect, useRef } from "react";

import { EventBus } from "@components/phaser/EventBus";
import { LaunchScene } from "@components/phaser/LaunchScene";
import { deepEquals } from "@/util/Objects";

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
    const scenesRef = useRef<PhaserScenesType>(props.scenes);
    const launchDataRef = useRef<object | undefined>(props.launch.data);

    if (!deepEquals(scenesRef.current, props.scenes)) {
        scenesRef.current = props.scenes;
    }

    if (!deepEquals(launchDataRef.current, props.launch.data)) {
        launchDataRef.current = props.launch.data;
    }

    useLayoutEffect(() => {
        if (!gameRef.current) {
            gameRef.current = LaunchScene(
                "game-canvas",
                scenesRef.current,
                props.viewport.width,
                props.viewport.height,
            );
            gameRef.current.scene.start(props.launch.key, launchDataRef.current);

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
    }, [ref, gameRef, scenesRef, launchDataRef, props.viewport.width, props.viewport.height, props.launch.key]);

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
