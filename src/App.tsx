import "@/App.css";

import { Routes, Route, Navigate } from "react-router";

import LocalisationProvider from "@/util/LocalisationContext";
import RootNavigator from "@/pages/base/RootNavigator";
import { getHomeUrl } from "@/util/Navigation";

function App() {
    return (
        <Routes>
            <Route path="/:pageId" element={
                <LocalisationProvider translationsRes="/pages/localisation.json">
                    <RootNavigator />
                </LocalisationProvider>
            } />
            <Route path="*" element={<Navigate to={getHomeUrl()} replace />} />
        </Routes>
    );
}

export default App;
