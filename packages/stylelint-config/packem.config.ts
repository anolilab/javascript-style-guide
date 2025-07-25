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
    transformer,
    validation: {
        dependencies: {
            unused: {
                exclude: [
                    "stylelint-config-clean-order",
                    "stylelint-config-standard",
                    "stylelint-declaration-block-no-ignored-properties",
                    "stylelint-high-performance-animation",
                    "stylelint-no-unsupported-browser-features",
                    "stylelint-require-units",
                    "stylelint-selector-no-empty"
                ],
            },
        },
    },
});
