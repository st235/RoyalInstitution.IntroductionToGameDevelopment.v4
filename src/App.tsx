import "./App.css";
import gameConfig from "@assets/game.json";

import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";
import type { MazeSceneParams } from "@game/MazeScene";

import { useRef } from "react";

import PhaserGameContainer from "./components/phaser/PhaserGameContainer";
import MazeScene from "./game/MazeScene";

function App() {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <>
            <PhaserGameContainer
                viewport={{width: 220, height: 180}}
                launch={{scene: MazeScene, key: "MazeScene", data: gameConfig}}
                containerRef={phaserRef}
            />
        </>
    );
}

export default App;
