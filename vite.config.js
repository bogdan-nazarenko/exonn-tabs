import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    resolve: {
        alias: [
            {
                find: "@data",
                replacement: path.resolve("src/data"),
            },
            {
                find: "@fonts",
                replacement: path.resolve("src/fonts"),
            },
            {
                find: "@libs",
                replacement: path.resolve("src/libs"),
            },
            {
                find: "@ui",
                replacement: path.resolve("src/ui"),
            },
            {
                find: "@media",
                replacement: path.resolve("src/media"),
            },
            {
                find: "@styles",
                replacement: path.resolve("src/styles"),
            },
            {
                find: "@utils",
                replacement: path.resolve("src/utils"),
            },
        ],
    },
});
