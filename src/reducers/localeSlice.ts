import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { ReadFromLocalStorage, SaveToLocalStorage } from "@/util/LocalStorageUtil";

const _LOCAL_STORAGE_KEY_SELECTED_LANGUAGE = "locale-state.selected-language";

type LocaleState = {
    selectedLanguage?: string;
    defaultLanguage: string;
    supportedLanguages: string[];
};

const initialState: LocaleState = {
    selectedLanguage: ReadFromLocalStorage<string | undefined>(_LOCAL_STORAGE_KEY_SELECTED_LANGUAGE, undefined),
    defaultLanguage: "en",
    supportedLanguages: ["en", "ru"],
};

const localeSlice = createSlice({
    name: "locale",
    initialState,
    reducers: {
        selectLanguage: (state: LocaleState, action: PayloadAction<string>) => {
            const selectedLanguage = action.payload;
            SaveToLocalStorage(_LOCAL_STORAGE_KEY_SELECTED_LANGUAGE, selectedLanguage);
            state.selectedLanguage = selectedLanguage;
        },
    },
});

export { localeSlice };
export const { selectLanguage } = localeSlice.actions;
export default localeSlice.reducer;
