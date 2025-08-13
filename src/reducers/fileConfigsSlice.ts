import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { MazeSceneParams } from "@game/scenes/MazeScene";

type FileConfigsSlice = {
    selectedFileConfig?: MazeSceneParams;
};

const initialState: FileConfigsSlice = {
    selectedFileConfig: undefined,
};

const fileConfigsSlice = createSlice({
    name: "fileConfigs",
    initialState,
    reducers: {
        loadFileConfig: (state: FileConfigsSlice, action: PayloadAction<MazeSceneParams>) => {
            state.selectedFileConfig = action.payload;
        },
    },
});

export { fileConfigsSlice };
export const { loadFileConfig } = fileConfigsSlice.actions;
export default fileConfigsSlice.reducer;
