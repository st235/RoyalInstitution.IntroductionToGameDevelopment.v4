import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import resolveConfig from "./vite.resolve.config.ts";

export default defineConfig({
    plugins: [react()],
    base: "/RoyalInstitution.IntroductionToGameDevelopment.v4",
    resolve: {
        alias: {
            ...resolveConfig,
        },
    },
});
