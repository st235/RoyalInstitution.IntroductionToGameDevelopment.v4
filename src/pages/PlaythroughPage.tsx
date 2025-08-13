import defaultLevelConfig from "@assets/pages/exercises/exercise_dialog_default_level_config.json";
import playthroughDemoConfig from "@assets/game/demos/playthrough_demo.json";
import riMondayDemoConfig from "@assets/game/demos/ri_monday_demo.json";

import { useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";

import { AssociateStateAndPersistencyId, CanCompletePage, GetPageTraversalContext, MergeComponentStates } from "@/util/PageUtil";
import { completePage } from "@/reducers/pagesSlice";
import { ObtainGameAndLevelConfigsOverwrites } from "@/util/GameConfigUtil";
import { useDeepCompareMemo } from "@/hooks/useDeepEffects";
import ComponentFactory from "@/pages/base/components/component-factory/ComponentFactory";
import DragHandler from "@components/drag-handler/DragHandler";
import GameControlsLayout from "@/pages/base/components/game-controls-layout/GameControlsLayout";
import GameInteractiveContainer from "@/pages/base/components/game-interactive-container/GameInteractiveContainer";
import PageInteractiveContainer from "@/pages/base/components/page-interactive-container/PageInteractiveContainer";
import PanelsLayout from "@components/panels-layout/PanelsLayout";
import type { ComponentPersistentState } from "@/models/ui-data/ComponentPersistentState";
import type { GameConfig } from "@game/config/GameConfigReader";
import type { LevelConfig } from "@game/config/LevelConfigReader";
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

    const [inMemoryGameConfig, inMemoryLevelConfig, componentPersistentStates] = 
        useDeepCompareMemo<[GameConfig | undefined, LevelConfig | undefined, ComponentPersistentState[]]>(() => {
            const pageTraversalContext = GetPageTraversalContext(page.id);

            const [gameConfig, levelConfig] = ObtainGameAndLevelConfigsOverwrites(
                AssociateStateAndPersistencyId(
                    globalComponentsState.pageToComponentsLookup,
                    pageTraversalContext
                )
            );

            const componentPersistenceStates = page.components.map(component => 
                MergeComponentStates(component.id, globalComponentsState.pageToComponentsLookup, pageTraversalContext));

            return [gameConfig, levelConfig, componentPersistenceStates];
        }, [globalComponentsState.pageToComponentsLookup, page.components, page.id]);

    const completedPagesIds = pagesState.completedPageIds;
    useEffect(() => {
        if (!completedPagesIds.find(i => i == page.id) && 
            CanCompletePage(page, globalComponentsState.pageToComponentsLookup)) {
            dispatch(completePage(page.id));
        }
    }, [completedPagesIds, dispatch, globalComponentsState.pageToComponentsLookup, page]);

    const mazeSceneProps = useMemo<MazeSceneParams>(() => {
        switch (page.asset) {
        case "ri_monday_demo.json": return riMondayDemoConfig;
        case "playthrough_demo.json": return playthroughDemoConfig;
        }

        return {
            initialLevelId: inMemoryLevelConfig?.id ?? 0,
            gameConfig: inMemoryGameConfig,
            levels: [inMemoryLevelConfig ?? defaultLevelConfig],
        };
    }, [inMemoryGameConfig, inMemoryLevelConfig, page.asset]);

    return (
        <>
            <PanelsLayout
                columns={[
                    {
                        content: (
                            <PageInteractiveContainer>
                                {page.components.map((component, index) => (
                                    <ComponentFactory
                                        key={`${page.id}-${component.id}`}
                                        pageId={page.id}
                                        component={component}
                                        savedState={componentPersistentStates[index]}
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
