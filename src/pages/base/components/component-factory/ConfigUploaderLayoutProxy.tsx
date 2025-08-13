import React from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import { AssociateStateAndPersistencyId, GetPageTraversalContext } from "@/util/PageUtil";
import { loadFileConfig } from "@/reducers/fileConfigsSlice";
import { ObtainGameAndLevelConfigsOverwrites } from "@/util/GameConfigUtil";
import ConfigUploaderLayout from "@/pages/base/components/config-uploader-layout/ConfigUploaderLayout";
import type { ConfigUploaderData } from "@/models/ui-data/ConfigUploaderData";
import type { MazeSceneParams } from "@/game/scenes/MazeScene";

type ConfigUploaderLayoutProps = {
    pageId: string;
    componentId: string;
    data: ConfigUploaderData;
};

function ConfigUploaderLayoutProxy(props: ConfigUploaderLayoutProps): React.ReactNode {
    const dispatch = useAppDispatch();

    const globalComponentsState = useAppSelector(state => state.pageComponentsState);

    return (
        <ConfigUploaderLayout
            downloadButtonText="Download my config"
            uploadButtonText="Load someone's config"
            downloadFileName={props.data.downloadFilename}
            onDownloadConfig={() => {
                const shouldComposeGlobalConfig = props.data.shouldComposeGlobalConfig ?? true;
                const pageId = shouldComposeGlobalConfig ? undefined : props.pageId;

                const pageTraversalContext = GetPageTraversalContext(pageId);
                const [gameConfig, levelConfig] = ObtainGameAndLevelConfigsOverwrites(
                    AssociateStateAndPersistencyId(
                        globalComponentsState.pageToComponentsLookup,
                        pageTraversalContext
                    )
                );

                return {
                    initialLevelId: levelConfig?.id ?? 0,
                    gameConfig: gameConfig,
                    levels: levelConfig ? [levelConfig] : [],
                };
            }}
            onUploadConfig={fileConfigObject => {
                dispatch(loadFileConfig(fileConfigObject as MazeSceneParams));
            }} />
    );
}

export default ConfigUploaderLayoutProxy;
export type { ConfigUploaderLayoutProps };
