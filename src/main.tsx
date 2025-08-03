import "@/index.css";

import { HashRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { StrictMode } from "react";

import { store } from "@/reducers/store";
import App from "@/App.tsx";
 
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HashRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </HashRouter>
    </StrictMode>,
);
