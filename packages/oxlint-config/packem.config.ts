import { defineConfig } from "@visulima/packem/config";
import transformer from "@visulima/packem/transformer/esbuild";

export default defineConfig({
    node10Compatibility: {
        typeScriptVersion: ">=5.0",
        writeToPackageJson: true,
    },
    rollup: {
        license: {
            path: "./LICENSE.md",
        },
    },
    runtime: "node",
    transformer,
    validation: {
        dependencies: {
            unused: {
                // `oxlint` is a peer dependency and the plugins are loaded by oxlint through `jsPlugins`, so none is imported.
                exclude: [
                    "oxlint",
                    "@eslint-community/eslint-plugin-eslint-comments",
                    "eslint-plugin-no-secrets",
                    "eslint-plugin-regexp",
                    "eslint-plugin-sonarjs",
                    "oxlint-plugin-react-doctor",
                    "oxlint-tsgolint",
                ],
            },
        },
    },
});
