import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { AppendCompletedPageId, GetDefaultPageId, GetDefaultStatefulPages } from "@/util/PageUtil";
import { ReadFromLocalStorage, SaveToLocalStorage } from "@/util/LocalStorageUtil";
import type { StatefulPage } from "@/models/PageDescriptor";

const _LOCAL_STORAGE_KEY_SELECTED_PAGE_ID = "pages-state.selected-page-id";
const _LOCAL_STORAGE_KEY_COMPLETED_PAGES_LIST = "pages-state.completed-pages-list";

type PagesState = {
    selectedPageId: string;
    completedPageIds: string[];
    pagesLookup: { [id: string] : StatefulPage };
};

function _GetPagesLookup(): { [id: string] : StatefulPage } {
    return Object.fromEntries(
        GetDefaultStatefulPages(
            ReadFromLocalStorage<string[]>(_LOCAL_STORAGE_KEY_COMPLETED_PAGES_LIST, [])
        ).map(page => [page.id, page])
    );
}

const initialState: PagesState = {
    selectedPageId: ReadFromLocalStorage<string>(_LOCAL_STORAGE_KEY_SELECTED_PAGE_ID, GetDefaultPageId()),
    completedPageIds: ReadFromLocalStorage<string[]>(_LOCAL_STORAGE_KEY_COMPLETED_PAGES_LIST, []),
    pagesLookup: _GetPagesLookup(),
};

const pagesSlice = createSlice({
    name: "pages",
    initialState,
    reducers: {
        selectPage: (state: PagesState, action: PayloadAction<string>) => {
            const selectedPageId = action.payload;
            SaveToLocalStorage(_LOCAL_STORAGE_KEY_SELECTED_PAGE_ID, selectedPageId);
            state.selectedPageId = selectedPageId;
        },
        completePage: (state: PagesState, action: PayloadAction<string>) => {
            const completedPageId = action.payload;
            const newCompletedPageIds = AppendCompletedPageId(state.completedPageIds, completedPageId);

            SaveToLocalStorage(_LOCAL_STORAGE_KEY_COMPLETED_PAGES_LIST, newCompletedPageIds);

            state.completedPageIds = newCompletedPageIds;
            state.pagesLookup = _GetPagesLookup();
        },
    },
});

export { pagesSlice };
export const { selectPage, completePage } = pagesSlice.actions;
export default pagesSlice.reducer;
