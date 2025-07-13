import { defineConfig, configDefaults } from "vitest/config";
import resolveConfig from "./vite.resolve.config.ts";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        css: true,
        setupFiles: "./vitest.setup.ts",
        exclude: [...configDefaults.exclude],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"]
        }
    },
    resolve: {
        alias: {
            ...resolveConfig,
        },
    },
});
