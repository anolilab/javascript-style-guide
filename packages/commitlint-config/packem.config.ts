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
    transformer,
    validation: {
        dependencies: {
            unused: {
                exclude: [
                    "@commitlint/config-conventional",
                    "@commitlint/core",
                    "commitizen",
                    "conventional-changelog-conventionalcommits",
                    "cz-conventional-changelog",
                ],
            },
        },
    },
});
