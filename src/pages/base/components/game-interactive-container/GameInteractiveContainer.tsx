import "@/pages/base/components/game-interactive-container/GameInteractiveContainer.css";

import React, { useRef } from "react";

import MazeScene from "@/game/scenes/MazeScene";
import PhaserGameContainer from "@components/phaser/PhaserGameContainer";
import StartScene from "@/game/scenes/StartScene";
import TextDialogScene from "@game/scenes/TextDialogScene";
import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";

interface GameInteractiveContainerProps extends React.PropsWithChildren {
    initialScene?: string;
    data?: object;
}

function GameInteractiveContainer(props: GameInteractiveContainerProps) {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <div className="game-interactive-container">
            <PhaserGameContainer
                viewport={{width: 220, height: 180}}
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
