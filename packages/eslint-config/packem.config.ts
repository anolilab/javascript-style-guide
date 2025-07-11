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
    validation: {
        dependencies: {
            unused: {
                exclude: [
                    "@html-eslint/eslint-plugin",
                    "@html-eslint/parser",
                    "@typescript-eslint/types",
                    "@stylistic/eslint-plugin-ts",
                    "eslint-import-resolver-node",
                    "eslint-import-resolver-typescript",
                    "eslint-plugin-es-x",
                    "eslint-plugin-security",
                    "eslint-plugin-unused-imports",
                    "jsonc-eslint-parser",
                    "parse-gitignore",
                ],
            },
        },
    },
});
