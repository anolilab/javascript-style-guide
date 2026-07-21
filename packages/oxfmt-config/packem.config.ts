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
                // `oxfmt` is a peer dependency consumed only via its type export.
                exclude: ["oxfmt"],
            },
        },
    },
});
