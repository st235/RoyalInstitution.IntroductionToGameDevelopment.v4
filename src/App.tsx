import "./App.css";
import riMondayDemoConfig from "@assets/demos/ri_monday_demo.json";

import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";

import { useRef } from "react";

import MazeScene from "@/game/scenes/MazeScene";
import PhaserGameContainer from "./components/phaser/PhaserGameContainer";
import StartScene from "@/game/scenes/StartScene";
import TextDialogScene from "@game/scenes/TextDialogScene";

function App() {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <>
            <PhaserGameContainer
                viewport={{width: 220, height: 180}}
                launch={{key: "StartScene", data: riMondayDemoConfig}}
                scenes={[StartScene, MazeScene, TextDialogScene]}
                containerRef={phaserRef}
            />
        </>
    );
}

export default App;
