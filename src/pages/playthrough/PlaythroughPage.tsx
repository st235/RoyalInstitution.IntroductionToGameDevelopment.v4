import { useAppSelector, useAppDispatch } from "@/hooks/redux";

import { AssociateStateAndPersistencyId, CanCompletePage } from "@/util/PageUtil";
import { completePage } from "@/reducers/pagesSlice";
import { ObtainGameAndLevelConfigsOverwrites } from "@/util/GameConfigUtil";
import { useEffect } from "react";
import ComponentFactory from "@/pages/base/components/component-factory/ComponentFactory";
import DragHandler from "@components/drag-handler/DragHandler";
import GameControlsLayout from "@/pages/base/components/game-controls-layout/GameControlsLayout";
import GameInteractiveContainer from "@/pages/base/components/game-interactive-container/GameInteractiveContainer";
import PageInteractiveContainer from "@/pages/base/components/page-interactive-container/PageInteractiveContainer";
import PanelsLayout from "@components/panels-layout/PanelsLayout";
import type { MazeSceneParams } from "@game/scenes/MazeScene";
import type { Page } from "@/models/Page";

type PlaythroughPageProps = {
    page: Page;
};

function PlaythroughPage(props: PlaythroughPageProps) {
    const page = props.page;
    const dispatch = useAppDispatch();

    const pagesState = useAppSelector(state => state.pagesState);
    const globalComponentsState = useAppSelector(state => state.pageComponentsState);
    const pageComponentsState = globalComponentsState.pageToComponentsLookup[page.id] ?? {};

    const [gameConfig, levelConfig] = ObtainGameAndLevelConfigsOverwrites(
        AssociateStateAndPersistencyId(globalComponentsState.pageToComponentsLookup)
    );

    const completedPagesIds = pagesState.completedPageIds;
    useEffect(() => {
        if (!completedPagesIds.find(i => i == page.id) && 
            CanCompletePage(page, globalComponentsState.pageToComponentsLookup)) {
            dispatch(completePage(page.id));
        }
    }, [completedPagesIds, dispatch, globalComponentsState.pageToComponentsLookup, page]);

    const mazeSceneProps: MazeSceneParams = {
        initialLevelId: levelConfig?.id ?? 0,
        gameConfig: gameConfig,
        levels: [
            {
                id: levelConfig?.id ?? 0,
                title: levelConfig?.title ?? "Workshop level",
                levelLayout: levelConfig?.levelLayout ?? [],
                constraints: levelConfig?.constraints ?? {},
            }
        ]
    };

    return (
        <>
            <PanelsLayout
                columns={[
                    {
                        content: (
                            <PageInteractiveContainer>
                                {page.components.map(component => (
                                    <ComponentFactory
                                        key={component.id}
                                        pageId={page.id}
                                        component={component}
                                        savedState={pageComponentsState[component.id]}
                                    />
                                ))}
                            </PageInteractiveContainer>
                        ),
                        defaultWeight: 1,
                        minWidth: 600,
                    },
                    {
                        content: (
                            <GameInteractiveContainer data={mazeSceneProps}>
                                <GameControlsLayout />
                            </GameInteractiveContainer>
                        ),
                        defaultWeight: 1,
                        minWidth: 600,
                    },
                ]}
                resizer={<DragHandler variant="collapsed" />}
            />
        </>
    );
}

export default PlaythroughPage;
export type { PlaythroughPageProps };
