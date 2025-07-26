import defaultPagesContent from "@assets/pages/default_content.json";

import type { Page, StatefulPage, PageState } from "@/models/Page";

const pagesLookup: { [id: string]: Page } =
    Object.fromEntries(
        defaultPagesContent.pages.map(page => {
            return {
                id: page.id,
                ordinal: page.ordinal,
                title: page.title,
                description: page.description,
                shoudOpen: page.shouldOpen ?? [],
                sandboxPlaceholder: page.sandboxPlaceholder,
            };
        }).map(page => [page.id, page])
    );

function GetDefaultPageId(): string {
    return defaultPagesContent.defaultPageId;
}

function GetDefaultStatefulPages(completedExerciseIds: string[]): StatefulPage[] {
    const completedExerciseIdsLookup = new Set<string>(completedExerciseIds);

    const openedExerciseIds = new Set<string>(
        defaultPagesContent.openByDefault as string[]
    );

    for (const completedId of completedExerciseIdsLookup) {
        const openedIds = pagesLookup[completedId].shoudOpen;
        for (const openedId of openedIds) {
            openedExerciseIds.add(openedId);
        }
    }

    return Object.values(pagesLookup).map(exercise => {
        const isCompleted: boolean = completedExerciseIdsLookup.has(exercise.id);
        const isOpened: boolean = openedExerciseIds.has(exercise.id);

        let state: PageState = "locked";
        if (isCompleted) {
            state = "completed";
        } else if (isOpened) {
            state = "in-progress";
        }

        return {
            ...exercise,
            state,
        };
    }).sort((one, another) => one.ordinal - another.ordinal);
}

function AppendCompletedPageId(completedExerciseIds: string[], id: string): string[] {
    const completedExerciseIdsLookup = new Set<string>(completedExerciseIds);
    completedExerciseIdsLookup.add(id);
    return Array.from(completedExerciseIdsLookup.values());
}

export {
    AppendCompletedPageId,
    GetDefaultPageId,
    GetDefaultStatefulPages,
};
