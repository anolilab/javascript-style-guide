import { defineConfig } from "@visulima/packem/config";
import isolatedDeclarationTransformer from "@visulima/packem/dts/isolated/transformer/typescript";
import transformer from "@visulima/packem/transformer/esbuild";

export default defineConfig({
    cjsInterop: true,
    isolatedDeclarationTransformer,
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
});
