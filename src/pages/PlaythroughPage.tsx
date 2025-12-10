import "@/pages/PlaythroughPage.css";

import defaultLevelConfig from "@assets/pages/exercises/exercise_dialog_default_level_config.json";

import { useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { usePageContent } from "@/hooks/usePageContent";

import { AssociateStateAndPersistencyId, CanCompletePage, GetPageTraversalContext, MergeComponentStates } from "@/util/PageUtil";
import { completePage } from "@/reducers/pagesSlice";
import { ObtainGameAndLevelConfigsOverwrites, GetViewportSizeFromGameField } from "@/util/GameConfigUtil";
import { useDeepCompareMemo } from "@/hooks/useDeepEffects";
import ComponentFactory from "@/pages/base/components/component-factory/ComponentFactory";
import DragHandler from "@components/drag-handler/DragHandler";
import GameInteractiveContainer from "@/pages/base/components/game-interactive-container/GameInteractiveContainer";
import PageInteractiveContainer from "@/pages/base/components/page-interactive-container/PageInteractiveContainer";
import PanelsLayout from "@components/panels-layout/PanelsLayout";
import Spinner from "@/components/spinner/Spinner";
import type { ComponentPersistentState } from "@/models/ui-data/ComponentPersistentState";
import type { GameConfig } from "@game/config/GameConfigReader";
import type { LevelConfig } from "@game/config/LevelConfigReader";
import type { MazeSceneParams } from "@game/scenes/MazeScene";
import type { PageDescriptor } from "@/models/PageDescriptor";

type PlaythroughPageProps = {
    page: PageDescriptor;
};

function PlaythroughPage(props: PlaythroughPageProps) {
    const page = props.page;
    const dispatch = useAppDispatch();
    const [[pageContent, levelConfigOverride], error, isLoading] = usePageContent(page.id);

    const pagesState = useAppSelector(state => state.pagesState);
    const globalComponentsState = useAppSelector(state => state.pageComponentsState);
    const fileConfigsState = useAppSelector(state => state.fileConfigsState);

    const requestedViewport = useMemo(
        () => GetViewportSizeFromGameField(page.requestedViewport.width, page.requestedViewport.height),
        [page]);

    const [inMemoryGameConfig, inMemoryLevelConfig, componentPersistentStates] = 
        useDeepCompareMemo<[GameConfig | undefined, LevelConfig | undefined, ComponentPersistentState[]]>(() => {
            const pageTraversalContext = GetPageTraversalContext(page.id);

            const [gameConfig, levelConfig] = ObtainGameAndLevelConfigsOverwrites(
                AssociateStateAndPersistencyId(
                    globalComponentsState.pageToComponentsLookup,
                    pageTraversalContext
                )
            );

            const componentPersistenceStates = pageContent?.components?.map(component => 
                MergeComponentStates(component.id, globalComponentsState.pageToComponentsLookup, pageTraversalContext)
            ) ?? [];

            return [gameConfig, levelConfig, componentPersistenceStates];
        }, [globalComponentsState.pageToComponentsLookup, pageContent, page.id]);

    const completedPagesIds = pagesState.completedPageIds;
    useEffect(() => {
        if (!isLoading && !completedPagesIds.find(i => i == page.id) && 
            CanCompletePage(page, pageContent?.components, globalComponentsState.pageToComponentsLookup)) {
            dispatch(completePage(page.id));
        }
    }, [completedPagesIds, dispatch, globalComponentsState.pageToComponentsLookup, page, pageContent, isLoading]);

    const mazeSceneProps = useDeepCompareMemo<MazeSceneParams>(() => {
        if (pageContent?.isLocalConfigAllowed && fileConfigsState.selectedFileConfig) {
            return fileConfigsState.selectedFileConfig;
        }

        if (levelConfigOverride) {
            return levelConfigOverride;
        }

        return {
            initialLevelId: inMemoryLevelConfig?.id ?? 0,
            gameConfig: inMemoryGameConfig,
            levels: [inMemoryLevelConfig ?? defaultLevelConfig],
        };
    }, [pageContent, fileConfigsState.selectedFileConfig, inMemoryGameConfig, inMemoryLevelConfig, levelConfigOverride]);

    const shouldShowSpinner = (isLoading || error);
    return (
        <>
            {shouldShowSpinner && <div className="playthroughpage spinner-container"><Spinner size="large" variant="primary" /></div>}
            {!shouldShowSpinner && <PanelsLayout
                columns={[
                    {
                        content: (
                            <PageInteractiveContainer>
                                {pageContent?.components?.map((component, index) => (
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
                            <GameInteractiveContainer
                                viewport={{width:requestedViewport[0], height: requestedViewport[1]}}
                                data={mazeSceneProps} />
                        ),
                        defaultWeight: 1,
                        minWidth: 600,
                    },
                ]}
                resizer={<DragHandler variant="collapsed" />}
            />}
        </>
    );
}

export default PlaythroughPage;
export type { PlaythroughPageProps };
