import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { deepEquals } from "@/util/Objects";
import { ReadFromLocalStorage, SaveToLocalStorage } from "@/util/LocalStorageUtil";
import type { ComponentPersistentState } from "@/models/ui-data/ComponentPersistentState";

const _LOCAL_STORAGE_KEY_PERSISTED_PAGE_IDS = "page-content-state.persisted-page-ids";

const _LOCAL_STORAGE_KEY_PERSISTED_COMPONENT_IDS_PREFIX = "page-content-state.persisted-component-ids";
const _LOCAL_STORAGE_KEY_PAGE_COMPONENT_STATES_PREFIX = "page-content-state.page-component-states";

type PageComponentStates = {[Key: string]: ComponentPersistentState};
type GlobalStatesLookup = {[Key: string]: PageComponentStates};

function _ObtainPagePersistentComponentsKey(pageId: string) {
    return `${_LOCAL_STORAGE_KEY_PERSISTED_COMPONENT_IDS_PREFIX}.${pageId}`;
}

function _ObtainPageComponentStateKey(pageId: string, componentId: string) {
    return `${_LOCAL_STORAGE_KEY_PAGE_COMPONENT_STATES_PREFIX}.${pageId}.${componentId}`;
}

function _UpdateIdsLookup(key: string, id: string) {
    const oldIdsLookup = new Set<string>(ReadFromLocalStorage<string[]>(key, []));
    const newIdsLookup = new Set(oldIdsLookup);
    newIdsLookup.add(id);

    if (!deepEquals(oldIdsLookup, newIdsLookup)) {
        SaveToLocalStorage(key, Array.from(newIdsLookup.values()));
    }
}

function _ReadGlobalStatesLookup(): GlobalStatesLookup {
    const globalStatesLookup: GlobalStatesLookup = {};

    for (const persistedPageId of ReadFromLocalStorage<string[]>(_LOCAL_STORAGE_KEY_PERSISTED_PAGE_IDS, [])) {
        for (const persistedComponentId of ReadFromLocalStorage<string[]>(_ObtainPagePersistentComponentsKey(persistedPageId), [])) {
            const componentPersistedStateKey = _ObtainPageComponentStateKey(persistedPageId, persistedComponentId);
            const componentPersistedState = ReadFromLocalStorage<ComponentPersistentState | undefined>(componentPersistedStateKey, undefined);
            if (!componentPersistedState) {
                continue;
            }

            if (!globalStatesLookup[persistedPageId]) {
                globalStatesLookup[persistedPageId] = {};
            }

            globalStatesLookup[persistedPageId][persistedComponentId] = componentPersistedState;
        }
    }

    return globalStatesLookup;
}

type pageComponentsState = {
    pageToComponentsLookup: GlobalStatesLookup;
};

const initialState: pageComponentsState = {
    pageToComponentsLookup: _ReadGlobalStatesLookup(),
};

type PayloadUpdateComponentState = {
    pageId: string;
    componentId: string;
    persistencyId: string;
    state?: object;
}

const pageComponentsState = createSlice({
    name: "page-content",
    initialState,
    reducers: {
        updateComponent: (state: pageComponentsState, action: PayloadAction<PayloadUpdateComponentState>) => {
            const payload = action.payload;

            if (!state.pageToComponentsLookup[payload.pageId]) {
                state.pageToComponentsLookup[payload.pageId] = {};
            }

            const componentPersistentState: ComponentPersistentState = {
                persistencyId: payload.persistencyId,
                state: payload.state,
            };

            // Early return in case the object stored in memory is already like the one we received.
            if (deepEquals(state.pageToComponentsLookup[payload.pageId][payload.componentId], componentPersistentState)) {
                return;
            }

            _UpdateIdsLookup(_LOCAL_STORAGE_KEY_PERSISTED_PAGE_IDS, payload.pageId);
            _UpdateIdsLookup(_ObtainPagePersistentComponentsKey(payload.pageId), payload.componentId);

            state.pageToComponentsLookup[payload.pageId][payload.componentId] = componentPersistentState;

            const componentPersistedStateKey = _ObtainPageComponentStateKey(payload.pageId, payload.componentId);
            SaveToLocalStorage(componentPersistedStateKey, componentPersistentState);
        },
    },
});

export { pageComponentsState };
export const { updateComponent } = pageComponentsState.actions;
export default pageComponentsState.reducer;
