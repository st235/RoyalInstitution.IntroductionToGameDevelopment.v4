import defaultPagesContent from "@assets/pages/default_content.json";

import type { Page, StatefulPage, PageState } from "@/models/Page";
import type { PersistentData } from "@/models/ui-data/PersistentData";
import type { ComponentPersistentState } from "@/models/ui-data/ComponentPersistentState";

type PageComponentsState = {[Key: string]: {[Key: string]: { persistencyId: string, state: object | undefined }}};

const pagesLookup: { [id: string]: Page } =
    Object.fromEntries(
        defaultPagesContent.pages.map(page => {
            return {
                id: page.id,
                ordinal: page.ordinal,
                shoudOpen: page.shouldOpen ?? [],
                components: page.components,
                asset: page.asset,
                isHidden: page.isHidden,
                isOpenByDefault: page.isOpenByDefault,
            };
        }).map(page => [page.id, page])
    );

const pageTraversalContextLookup: { [id: string]: string[] } = {};

function GetDefaultPageId(): string {
    return defaultPagesContent.defaultPageId;
}

function GetPageTraversalContext(pageId: string): string[] {
    if (pageTraversalContextLookup[pageId]) {
        return pageTraversalContextLookup[pageId];
    }

    const visitedIds = new Set<string>();
    const outPages: string[] = [];
    const queue: string[] = [];

    queue.push(defaultPagesContent.defaultPageId);
    while (queue.length > 0) {
        const currentPageId = queue.shift();
        if (!currentPageId) {
            continue;
        }

        outPages.push(currentPageId);
        visitedIds.add(currentPageId);

        if (currentPageId === pageId) {
            break;
        }

        for (const childPageId of pagesLookup[currentPageId].shoudOpen) {
            if (!visitedIds.has(childPageId)) {
                visitedIds.add(childPageId);
                queue.push(childPageId);
            }
        }
    }

    pageTraversalContextLookup[pageId]= outPages;
    return outPages;
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
        const isOpened: boolean = openedExerciseIds.has(exercise.id) || 
            (exercise.isOpenByDefault ?? false);

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
    traversalContext?: string[],
): {[Key: string]: object} {
    const defaultTraversalContext = Object.keys(stateLookup);
    const currentTraversalContext = traversalContext ?? defaultTraversalContext;

    const outObject = {};

    for (const pageId of currentTraversalContext) {
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

function MergeComponentStates(
    componentId: string,
    componentStatesLookup: PageComponentsState,
    traversalContext: string[],
): ComponentPersistentState {
    const outObject = {};
    for (const pageId of traversalContext) {
        if (componentStatesLookup[pageId] && componentStatesLookup[pageId][componentId]) {
            Object.assign(outObject, componentStatesLookup[pageId][componentId]);
        }
    }
    return outObject as ComponentPersistentState;
}

export {
    AppendCompletedPageId,
    AssociateStateAndPersistencyId,
    CanCompletePage,
    GetDefaultPageId,
    GetDefaultStatefulPages,
    GetPageTraversalContext,
    MergeComponentStates,
};
