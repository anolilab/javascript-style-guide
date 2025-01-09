import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";

import type { OptionsComponentExtensions, OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig, getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import parserPlain from "../../utils/parser-plain";

export default createConfig<OptionsComponentExtensions & OptionsFiles & OptionsOverrides>("markdown", async (config, oFiles) => {
    const { componentExts: componentExtensions = [], files = oFiles, overrides } = config;

    const markdown = await interopDefault(import("@eslint/markdown"));

    return [
        {
            name: "anolilab/markdown/setup",
            plugins: {
                markdown,
            },
        },
        {
            files,
            ignores: getFilesGlobs("markdown_in_markdown"),
            name: "anolilab/markdown/processor",
            // `eslint-plugin-markdown` only creates virtual files for code blocks,
            // but not the markdown file itself. We use `eslint-merge-processors` to
            // add a pass-through processor for the markdown file itself.
            processor: mergeProcessors([markdown.processors?.markdown, processorPassThrough]),
        },
        {
            files,
            languageOptions: {
                parser: parserPlain,
            },
            name: "anolilab/markdown/parser",
            rules: markdown.configs.recommended[0].rules,
        },
        {
            files: ["**/*.md/**/*.?([cm])[jt]s?(x)", ...componentExtensions.map(extension => `**/*.md/**/*.${extension}`)],
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                },
            },
            name: "anolilab/markdown/disables",
            rules: {
                "@stylistic/comma-dangle": "off",
                "@stylistic/eol-last": "off",
                "@stylistic/prefer-global/process": "off",

                "@typescript-eslint/consistent-type-imports": "off",
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/no-namespace": "off",
                "@typescript-eslint/no-redeclare": "off",
                "@typescript-eslint/no-require-imports": "off",
                "@typescript-eslint/no-unused-expressions": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-use-before-define": "off",

                "antfu/no-top-level-await": "off",

                "import/newline-after-import": "off",

                "no-alert": "off",
                "no-console": "off",
                "no-labels": "off",
                "no-lone-blocks": "off",
                "no-restricted-syntax": "off",
                "no-undef": "off",

                "no-unused-expressions": "off",

                "no-unused-labels": "off",
                "no-unused-vars": "off",

                "unicode-bom": "off",
                "unused-imports/no-unused-imports": "off",
                "unused-imports/no-unused-vars": "off",

                ...overrides,
            },
        },
    ];
});
