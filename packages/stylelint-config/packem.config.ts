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
                    "stylelint-config-clean-order",
                    "stylelint-config-standard",
                    "stylelint-declaration-block-no-ignored-properties",
                    "stylelint-high-performance-animation",
                    "stylelint-no-unsupported-browser-features",
                    "stylelint-require-units",
                    "stylelint-selector-no-empty",
                    "browserslist-config-anolilab",
                ],
            },
        },
    },
});
