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
                // These are textlint rules referenced in the generated .textlintrc config.
                // They are loaded at runtime by textlint, not statically imported in bin.ts.
                exclude: [
                    "@textlint-rule/textlint-rule-no-invalid-control-character",
                    "@textlint-rule/textlint-rule-no-unmatched-pair",
                    "@textlint-rule/textlint-rule-preset-google",
                    "@textlint/ast-node-types",
                    "@textlint/types",
                    "textlint-filter-rule-comments",
                    "textlint-rule-abbr-within-parentheses",
                    "textlint-rule-alex",
                    "textlint-rule-apostrophe",
                    "textlint-rule-common-misspellings",
                    "textlint-rule-date-weekday-mismatch",
                    "textlint-rule-diacritics",
                    "textlint-rule-en-capitalization",
                    "textlint-rule-footnote-order",
                    "textlint-rule-helper",
                    "textlint-rule-no-dead-link",
                    "textlint-rule-no-empty-section",
                    "textlint-rule-no-todo",
                    "textlint-rule-terminology",
                    "textlint-rule-write-good",
                    "write-good",
                ],
            },
        },
        packageJson: {
            exports: false,
        },
    },
});
