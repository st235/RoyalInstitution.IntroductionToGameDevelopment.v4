import "@/App.css";

import { Routes, Route, Navigate } from "react-router";

import RootNavigator from "@/pages/base/RootNavigator";

function App() {
    return (
        <Routes>
            <Route path={`${import.meta.env.BASE_URL}/:pageId`} element={<RootNavigator />} />
            <Route path="*" element={<Navigate to={`${import.meta.env.BASE_URL}/default`} replace />} />
        </Routes>
    );
}

export default App;
