import "./App.css";
import riMondayDemoConfig from "@assets/demos/ri_monday_demo.json";

import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";

import { useRef } from "react";

import MazeScene from "@/game/scenes/MazeScene";
import PhaserGameContainer from "./components/phaser/PhaserGameContainer";
import StartScene from "@/game/scenes/StartScene";
import TextDialogScene from "@game/scenes/TextDialogScene";
import SideBarLayout from "@components/sidebar-layout/SideBarLayout";

function App() {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <>
            <SideBarLayout
                sidebar={<p>Hello world</p>}>
                <PhaserGameContainer
                    viewport={{width: 220, height: 180}}
                    launch={{key: "StartScene", data: riMondayDemoConfig}}
                    scenes={[StartScene, MazeScene, TextDialogScene]}
                    containerRef={phaserRef}
                />
            </SideBarLayout>
        </>
    );
}

export default App;
