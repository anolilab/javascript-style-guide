import { defineConfig } from "@visulima/packem/config";
import transformer from "@visulima/packem/transformer/esbuild";

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
    rollup: {
        license: {
            path: "./LICENSE.md",
        },
        node10Compatibility: {
            typeScriptVersion: ">=5.0",
            writeToPackageJson: true,
        },
    },
    validation: {
        dependencies: {
            unused: {
                exclude: [
                    "@commitlint/config-conventional",
                    "@commitlint/core",
                    "commitizen",
                    "conventional-changelog-conventionalcommits",
                    "cz-conventional-changelog"
                ],
            },
        },
    },
    transformer,
});
