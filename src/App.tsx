import "./App.css";
import gameConfig from "@assets/game.json";

import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";

import { useRef } from "react";

import PhaserGameContainer from "./components/phaser/PhaserGameContainer";
import MazeScene from "@game/MazeScene";
import StartScene from "@game/StartScene";

function App() {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <>
            <PhaserGameContainer
                viewport={{width: 220, height: 180}}
                launch={{key: "StartScene", data: gameConfig}}
                scenes={[StartScene, MazeScene]}
                containerRef={phaserRef}
            />
        </>
    );
}

export default App;
