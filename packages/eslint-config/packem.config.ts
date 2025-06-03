// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "@visulima/packem/config";
// eslint-disable-next-line import/no-extraneous-dependencies
import transformer from "@visulima/packem/transformer/esbuild";

export default defineConfig({
    cjsInterop: true,
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
});
