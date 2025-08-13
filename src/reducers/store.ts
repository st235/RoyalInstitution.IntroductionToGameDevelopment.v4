import { configureStore } from "@reduxjs/toolkit";

import pagesReducer from "@/reducers/pagesSlice";
import pageComponentsReducer from "@/reducers/pageComponentsSlice";
import fileConfigsReducer from "@/reducers/fileConfigsSlice";

export const store = configureStore({
    reducer: {
        pagesState: pagesReducer,
        pageComponentsState: pageComponentsReducer,
        fileConfigsState: fileConfigsReducer,
    },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
