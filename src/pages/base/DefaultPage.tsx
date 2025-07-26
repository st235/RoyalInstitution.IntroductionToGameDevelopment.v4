import riMondayDemoConfig from "@assets/game/demos/ri_monday_demo.json";

import type { PhaserGameContainerRef } from "@/components/phaser/PhaserGameContainer";

import { useRef } from "react";

import DragHandler from "@components/drag-handler/DragHandler";
import MazeScene from "@/game/scenes/MazeScene";
import PanelsLayout from "@components/panels-layout/PanelsLayout";
import PhaserGameContainer from "@components/phaser/PhaserGameContainer";
import StartScene from "@/game/scenes/StartScene";
import TextDialogScene from "@game/scenes/TextDialogScene";
import HtmlContentCard from "@components/html-content-card/HtmlContentCard";

const kText = `
  <p>Hello world</p>
  <p>Look at this amazing image below:</p>
  <img src="@public/gems-colour.png" />
`;

function DefaultPage() {
    const phaserRef = useRef<PhaserGameContainerRef>(null);

    return (
        <>
            <PanelsLayout
                columns={[
                    { content: (<HtmlContentCard id="1" title="Title" description={kText} />), defaultWeight: 1, minWidth: 200, },
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
        </>
    );
}

export default DefaultPage;
