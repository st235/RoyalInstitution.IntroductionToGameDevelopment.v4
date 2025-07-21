import "@/App.css";
import riMondayDemoConfig from "@assets/demos/ri_monday_demo.json";

import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";

import { useRef } from "react";

import DragHandler from "@components/drag-handler/DragHandler";
import MazeScene from "@/game/scenes/MazeScene";
import NavigationRail from "@components/navigation-rail/NavigationRail";
import PanelsLayout from "@components/panels-layout/PanelsLayout";
import PhaserGameContainer from "./components/phaser/PhaserGameContainer";
import SideBarLayout from "@components/sidebar-layout/SideBarLayout";
import StartScene from "@/game/scenes/StartScene";
import TextDialogScene from "@game/scenes/TextDialogScene";

function App() {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <>
            <SideBarLayout
                sidebar={
                    <NavigationRail
                        header={<p>Header</p>}
                        footer={<p>Footer</p>}>
                        {"Content"}
                    </NavigationRail>
                }>
                <PanelsLayout
                    columns={[
                        { content: (<p>Hello world</p>), defaultWeight: 1, minWidth: 200, },
                        { content: (
                            <PhaserGameContainer
                                viewport={{width: 220, height: 180}}
                                launch={{key: "StartScene", data: riMondayDemoConfig}}
                                scenes={[StartScene, MazeScene, TextDialogScene]}
                                containerRef={phaserRef}
                            />
                        ), defaultWeight: 1 },
                    ]}
                    resizer={<DragHandler variant="collapsed" />}
                />
            </SideBarLayout>
        </>
    );
}

export default App;
