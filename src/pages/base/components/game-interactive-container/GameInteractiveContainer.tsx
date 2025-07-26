import "@/pages/base/components/game-interactive-container/GameInteractiveContainer.css";

import { useRef } from "react";

import MazeScene from "@/game/scenes/MazeScene";
import PhaserGameContainer from "@components/phaser/PhaserGameContainer";
import StartScene from "@/game/scenes/StartScene";
import TextDialogScene from "@game/scenes/TextDialogScene";
import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";

type GameInteractiveContainerProps = {
    data?: object;
}

function GameInteractiveContainer(props: GameInteractiveContainerProps) {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <div className="game-interactive-container">
            <PhaserGameContainer
                viewport={{width: 220, height: 180}}
                launch={{key: "StartScene", data: props.data}}
                scenes={[StartScene, MazeScene, TextDialogScene]}
                containerRef={phaserRef}
            />
        </div>
    );
}

export default GameInteractiveContainer;
export type { GameInteractiveContainerProps };
