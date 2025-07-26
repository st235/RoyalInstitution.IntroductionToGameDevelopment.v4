import riMondayDemoConfig from "@assets/game/demos/ri_monday_demo.json";

import DragHandler from "@components/drag-handler/DragHandler";
import PageInteractiveContainer from "@/pages/base/components/page-interactive-container/PageInteractiveContainer";
import GameInteractiveContainer from "@/pages/base/components/game-interactive-container/GameInteractiveContainer";
import PanelsLayout from "@components/panels-layout/PanelsLayout";
import type { Page } from "@/models/Page";

type DemoPageProps = {
    page: Page;
};

function DemoPage(props: DemoPageProps) {
    const page = props.page;

    return (
        <>
            <PanelsLayout
                columns={[
                    { content: (<PageInteractiveContainer page={page} />), defaultWeight: 1, minWidth: 400, },
                    { content: (<GameInteractiveContainer data={riMondayDemoConfig} />), defaultWeight: 1, minWidth: 400, },
                ]}
                resizer={<DragHandler variant="collapsed" />}
            />
        </>
    );
}

export default DemoPage;
export type { DemoPageProps };
