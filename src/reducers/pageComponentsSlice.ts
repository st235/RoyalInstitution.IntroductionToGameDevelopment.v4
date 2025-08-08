import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ReadFromLocalStorage, SaveToLocalStorage } from "@/util/LocalStorageUtil";
import type { ComponentPersistentState } from "@/models/ui-data/ComponentPersistentState";

const _LOCAL_STORAGE_KEY_GLOBAL_PLAGE_CONTENT_STATE = "page-content-state.page-to-components-lookup";

type GlobalStatesLookup = {[Key: string]: {[Key: string]: ComponentPersistentState}};

type pageComponentsState = {
    pageToComponentsLookup: GlobalStatesLookup;
};

const initialState: pageComponentsState = {
    pageToComponentsLookup: ReadFromLocalStorage<GlobalStatesLookup>(_LOCAL_STORAGE_KEY_GLOBAL_PLAGE_CONTENT_STATE, {}),
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
            state.pageToComponentsLookup[payload.pageId][payload.componentId] = {
                persistencyId: payload.persistencyId,
                state: payload.state,
            };

            SaveToLocalStorage(_LOCAL_STORAGE_KEY_GLOBAL_PLAGE_CONTENT_STATE, state.pageToComponentsLookup);
        },
    },
});

export { pageComponentsState };
export type { GlobalStatesLookup };
export const { updateComponent } = pageComponentsState.actions;
export default pageComponentsState.reducer;
