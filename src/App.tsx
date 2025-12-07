import "@/App.css";

import { Routes, Route, Navigate } from "react-router";

import RootNavigator from "@/pages/base/RootNavigator";
import { getHomeUrl } from "@/util/Navigation";

function App() {
    return (
        <Routes>
            <Route path="/:lang?/:pageId" element={<RootNavigator />} />
            <Route path="*" element={<Navigate to={getHomeUrl()} replace />} />
        </Routes>
    );
}

export default App;
