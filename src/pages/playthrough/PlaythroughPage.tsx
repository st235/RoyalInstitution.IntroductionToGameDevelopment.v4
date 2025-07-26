import playthroughDemo from "@assets/game/demos/playthrough_demo.json";

import DragHandler from "@components/drag-handler/DragHandler";
import PageInteractiveContainer from "@/pages/base/components/page-interactive-container/PageInteractiveContainer";
import GameInteractiveContainer from "@/pages/base/components/game-interactive-container/GameInteractiveContainer";
import PanelsLayout from "@components/panels-layout/PanelsLayout";
import LineNumberedTextarea from "@/components/line-numbered-textarea/LineNumberedTextarea";
import type { Page } from "@/models/Page";

type PlaythroughPageProps = {
    page: Page;
};

function InteractiveContainerContent() {
    return (
        <LineNumberedTextarea
            minLines={4}
        />
    );
}

function PlaythroughPage(props: PlaythroughPageProps) {
    const page = props.page;

    return (
        <>
            <PanelsLayout
                columns={[
                    {
                        content: (
                            <PageInteractiveContainer page={page}>
                                <InteractiveContainerContent />
                            </PageInteractiveContainer>
                        ),
                        defaultWeight: 1,
                        minWidth: 400,
                    },
                    {
                        content: (
                            <GameInteractiveContainer data={playthroughDemo} />
                        ),
                        defaultWeight: 1,
                        minWidth: 400,
                    },
                ]}
                resizer={<DragHandler variant="collapsed" />}
            />
        </>
    );
}

export default PlaythroughPage;
export type { PlaythroughPageProps };
