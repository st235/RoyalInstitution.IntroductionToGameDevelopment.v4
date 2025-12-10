import "@/pages/base/components/game-interactive-container/GameInteractiveContainer.css";

import React, { useLayoutEffect, useRef } from "react";

import MazeScene from "@/game/scenes/MazeScene";
import PhaserGameContainer from "@components/phaser/PhaserGameContainer";
import StartScene from "@/game/scenes/StartScene";
import TextDialogScene from "@game/scenes/TextDialogScene";
import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";

interface GameInteractiveContainerProps extends React.PropsWithChildren {
    initialScene?: string;
    viewport: { width: number, height: number };
    data?: object;
}

function GameInteractiveContainer(props: GameInteractiveContainerProps) {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    function onMouseLeavesContainer() {
        const gameRef = phaserRef.current;
        if (gameRef) {
            gameRef.game.pause();
            gameRef.game.sound.pauseAll();
            gameRef.game.input.enabled = false;
            if (gameRef.game.input.keyboard) {
                gameRef.game.input.keyboard.enabled = false;
            }
        }
    }

    function onMouseEntersContainer() {
        const gameRef = phaserRef.current;
        if (gameRef) {
            gameRef.game.resume();
            gameRef.game.sound.resumeAll();
            gameRef.game.input.enabled = true;
            if (gameRef.game.input.keyboard) {
                gameRef.game.input.keyboard.enabled = true;
            }
        }
    }

    useLayoutEffect(() => {
        onMouseLeavesContainer();
    });

    return (
        <div
            className="game-interactive-container"
            onMouseLeave={onMouseLeavesContainer}
            onMouseEnter={onMouseEntersContainer}>
            <PhaserGameContainer
                viewport={{width: props.viewport.width, height: props.viewport.height}}
                launch={{key: props.initialScene ?? "StartScene", data: props.data}}
                scenes={[StartScene, MazeScene, TextDialogScene]}
                containerRef={phaserRef}
            />
            {props.children}
        </div>
    );
}

export default GameInteractiveContainer;
export type { GameInteractiveContainerProps };
