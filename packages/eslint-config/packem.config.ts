// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "@visulima/packem/config";
// eslint-disable-next-line import/no-extraneous-dependencies
import transformer from "@visulima/packem/transformer/esbuild";

export default defineConfig({
    cjsInterop: true,
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
                    "@eslint-community/eslint-plugin-eslint-comments",
                    "@eslint/compat",
                    "@eslint/js",
                    "@eslint/markdown",
                    "@visulima/tsconfig",
                    "@vitest/eslint-plugin",
                    "confusing-browser-globals",
                    "eslint-flat-config-utils",
                    "eslint-merge-processors",
                    "eslint-plugin-antfu",
                    "eslint-plugin-compat",
                    "eslint-plugin-html",
                    "eslint-plugin-import-x",
                    "eslint-plugin-jsdoc",
                    "eslint-plugin-n",
                    "eslint-plugin-no-for-of-array",
                    "eslint-plugin-no-only-tests",
                    "eslint-plugin-no-secrets",
                    "eslint-plugin-no-unsanitized",
                    "eslint-plugin-perfectionist",
                    "eslint-plugin-promise",
                    "eslint-plugin-regexp",
                    "eslint-plugin-simple-import-sort",
                    "eslint-plugin-sonarjs",
                    "eslint-plugin-toml",
                    "eslint-plugin-unicorn",
                    "eslint-plugin-yml",
                    "globals",
                    "semver",
                    "toml-eslint-parser",
                    "typescript-eslint",
                    "yaml-eslint-parser",
                    "@stylistic/eslint-plugin",
                    "@typescript-eslint/parser",
                    "@visulima/package",
                    "eslint-config-flat-gitignore",
                    "eslint-plugin-jsonc",
                ],
            },
        },
    },
});
