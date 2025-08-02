import defaultPagesContent from "@assets/pages/default_content.json";

import type { Page, StatefulPage, PageState } from "@/models/Page";
import type { PersistentData } from "@/models/ui-data/PersistentData";

type PageComponentsState = {[Key: string]: {[Key: string]: { persistencyId: string, state: object | undefined }}};

const pagesLookup: { [id: string]: Page } =
    Object.fromEntries(
        defaultPagesContent.pages.map(page => {
            return {
                id: page.id,
                ordinal: page.ordinal,
                shoudOpen: page.shouldOpen ?? [],
                components: page.components,
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

function AssociateStateAndPersistencyId(
    stateLookup: PageComponentsState,
    targetPageId?: string
): {[Key: string]: object} {
    if (targetPageId) {
        return _AssociateStateAndPersistencyIdWithinPage(targetPageId, stateLookup);
    }

    const outObject = {};

    for (const pageId of Object.keys(stateLookup)) {
        const pageObject = _AssociateStateAndPersistencyIdWithinPage(pageId, stateLookup);
        Object.assign(outObject, pageObject);
    }

    return outObject;
}

function _AssociateStateAndPersistencyIdWithinPage(
    pageId: string,
    stateLookup: PageComponentsState,
): {[Key: string]: object} {
    const pageComponents = stateLookup[pageId];
    if (!pageComponents) {
        return {};
    }

    const outObject: {[Key: string]: object} = {};
    for (const component of Object.values(pageComponents)) {
        if (component.state) {
            outObject[component.persistencyId] = component.state;
        }
    }

    return outObject;
}

function CanCompletePage(
    page: Page,
    stateLookup: PageComponentsState,
): boolean {
    for (const component of Object.values(page.components)) {
        if (!(component.data as PersistentData | undefined)?.persistencyId) {
            continue;
        }

        if (!stateLookup[page.id] || !stateLookup[page.id][component.id]) {
            return false;
        }
    }

    return true;
}

export {
    AppendCompletedPageId,
    CanCompletePage,
    GetDefaultPageId,
    GetDefaultStatefulPages,
    AssociateStateAndPersistencyId,
};
