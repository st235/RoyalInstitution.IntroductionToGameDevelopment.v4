import "./App.css";

import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";

import { useRef } from "react";

import PhaserGameContainer from "./components/phaser/PhaserGameContainer";
import MazeScene from "./game/MazeScene";

function App() {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <>
            <PhaserGameContainer
                viewport={{width: 600, height: 500}}
                launch={{scene: MazeScene, key: "default-scene"}}
                containerRef={phaserRef}
            />
        </>
    );
}

export default App;
