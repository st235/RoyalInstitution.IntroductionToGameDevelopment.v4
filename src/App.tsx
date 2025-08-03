import "@/App.css";

import { Routes, Route, Navigate } from "react-router";

import RootNavigator from "@/pages/base/RootNavigator";

function App() {
    return (
        <Routes>
            <Route path="/:pageId" element={<RootNavigator />} />
            <Route path="*" element={<Navigate to="/default" replace />} />
        </Routes>
    );
}

export default App;
