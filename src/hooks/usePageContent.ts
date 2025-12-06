import type { PageContent } from "@/models/PageContent";
import type { MazeSceneParams } from "@game/scenes/MazeScene";

import { useMemo, useState } from "react";

async function _fetch<T>(baseUrl: string, url: string) {
    const request = await fetch(`${baseUrl}/${url}`);
    if (!request.ok) {
        throw new Error(`Request failed with: ${request.status}.`);
    }
    return await request.json() as T;
}

type PageContentWithGameConfig = readonly [PageContent | null, MazeSceneParams | null];

const usePageContent = (
    pageId: string,
): [PageContentWithGameConfig, unknown, boolean] => {
    const [data, setData] = useState<PageContentWithGameConfig>([null, null]);
    const [error, setError] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);

    const baseUrl = import.meta.env.BASE_URL;

    useMemo(() => {
        let isCancelled = false;

        async function loadPageData() {
            try {
                const pageContent = await _fetch<PageContent>(baseUrl, `pages/${pageId}.json`);
                let gameConfig: MazeSceneParams | null = null;
                if (pageContent.gameConfig) {
                    gameConfig = await _fetch<MazeSceneParams>(baseUrl, `pages/game-config/${pageContent.gameConfig}`);
                }
                if (!isCancelled) {
                    setData([pageContent, gameConfig]);
                }
            } catch (err) {
                if (!isCancelled) {
                    setError(err);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        loadPageData();

        return () => {
            isCancelled = true;
        };
    }, [baseUrl, pageId]);

    return [ data, error, loading ];
};

export { usePageContent };
