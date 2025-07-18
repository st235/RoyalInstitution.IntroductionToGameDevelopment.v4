import "./App.css";

import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";
import type { MazeSceneParams } from "@game/MazeScene";

import { useRef } from "react";

import PhaserGameContainer from "./components/phaser/PhaserGameContainer";
import MazeScene from "./game/MazeScene";

const sceneData: MazeSceneParams = {
    levelConfig: {
        id: 0,
        title: "Very first level",
        levelLayout: [
            "SP W0 G0 K0 W0 .  .  .  .  .  .  .  .  .  .  .  .  . ",
            ".  .  G0 G0 W0 .  .  .  .  .  .  .  .  .  .  .  .  . ",
            ".  W0 W0 W0 W0 .  .  .  .  .  .  .  .  .  .  .  .  . ",
            ".  D0 .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  . ",
            ".  W0 W3 W5 W5 .  .  .  .  .  .  .  .  .  .  .  W0 . ",
            ".  W0 .  .  .  .  .  .  .  .  .  .  .  .  .  .  W0 . ",
            ".  W0 .  .  .  .  .  .  .  .  .  .  .  .  .  .  W0 . ",
            ".  W0 .  .  .  .  .  .  .  .  .  .  .  .  .  .  W0 . ",
            ".  W0 .  .  .  .  .  .  .  .  .  .  .  .  .  .  W0 . ",
            "C0 W0 .  .  .  .  .  .  .  .  .  .  .  .  .  .  W0 . ",
            ".  W0 .  .  .  .  .  .  .  .  .  .  .  .  .  .  W0 . ",
            ".  W0 W1 W2 .  W0 .  .  .  .  .  .  .  .  .  .  W0 . ",
            ".  .  .  .  M1 .  .  .  .  .  .  .  .  .  .  .  W0 F0",
        ],
        constraints: {}
    }
};

function App() {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <>
            <PhaserGameContainer
                viewport={{width: 200, height: 150}}
                launch={{scene: MazeScene, key: "MazeScene", data: sceneData}}
                containerRef={phaserRef}
            />
        </>
    );
}

export default App;
