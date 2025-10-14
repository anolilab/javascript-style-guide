import { defineConfig } from "@visulima/packem/config";
import transformer from "@visulima/packem/transformer/esbuild";

export default defineConfig({
    runtime: "node",
    cjsInterop: true,
    rollup: {
        license: {
            path: "./LICENSE.md",
        },
    },
    node10Compatibility: {
        typeScriptVersion: ">=5.0",
        writeToPackageJson: true,
    },
    transformer,
    validation: {
        dependencies: {
            unused: {
                exclude: ["type-fest"],
            },
        },
    },
});
