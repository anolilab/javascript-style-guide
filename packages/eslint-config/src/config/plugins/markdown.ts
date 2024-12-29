import { createConfig, getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import parserPlain from "../../utils/parser-plain";
import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";
import type { OptionsComponentExts, OptionsFiles, OptionsOverrides } from "../../types";

export default createConfig<OptionsFiles & OptionsOverrides & OptionsComponentExts>("markdown", async (config, oFiles) => {
    const { componentExts = [], files = oFiles, overrides } = config;

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
            processor: mergeProcessors([markdown.processors!.markdown, processorPassThrough]),
        },
        {
            files,
            languageOptions: {
                parser: parserPlain,
            },
            name: "anolilab/markdown/parser",
            rules: {
                ...markdown.configs.recommended.rules,
            }
        },
        {
            files: ["**/*.md/**/*.?([cm])[jt]s?(x)", ...componentExts.map((ext) => `**/*.md/**/*.${ext}`)],
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                },
            },
            name: "anolilab/markdown/disables",
            rules: {
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
                "node/prefer-global/process": "off",
                "style/comma-dangle": "off",

                "style/eol-last": "off",
                "typescript/consistent-type-imports": "off",
                "typescript/explicit-function-return-type": "off",
                "typescript/no-namespace": "off",
                "typescript/no-redeclare": "off",
                "typescript/no-require-imports": "off",
                "typescript/no-unused-expressions": "off",
                "typescript/no-unused-vars": "off",
                "typescript/no-use-before-define": "off",

                "unicode-bom": "off",
                "unused-imports/no-unused-imports": "off",
                "unused-imports/no-unused-vars": "off",

                ...overrides,
            },
        },
    ];
});
