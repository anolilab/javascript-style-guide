import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";

import type {
    OptionsComponentExtensions,
    OptionsFiles,
    OptionsMarkdown,
    OptionsOverrides,
} from "../../types";
import { createConfig, getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<
    OptionsComponentExtensions
    & OptionsFiles
    & OptionsMarkdown
    & OptionsOverrides
>("markdown", async (config, oFiles) => {
    const {
        componentExts: componentExtensions = [],
        files = oFiles,
        gfm = true,
        overrides,
        overridesMarkdown,
    } = config;

    const [tseslint, markdown] = await Promise.all([
        interopDefault(import("typescript-eslint")),
        interopDefault(import("@eslint/markdown")),
    ] as const);

    const disableTypeChecked = tseslint.configs.disableTypeChecked.rules;

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
            processor: mergeProcessors([
                markdown.processors.markdown,
                processorPassThrough,
            ]),
        },
        {
            files,
            language: gfm ? "markdown/gfm" : "markdown/commonmark",
            name: "anolilab/markdown/parser",
        },
        {
            files,
            name: "anolilab/markdown/rules",
            rules: {
                ...markdown.configs.recommended[0]?.rules,
                // https://github.com/eslint/markdown/issues/294
                "markdown/no-missing-label-refs": "off",

                ...overridesMarkdown,
            },
        },
        {
            files,
            name: "anolilab/markdown/disables/markdown",
            rules: {
                "@stylistic/indent": "off",

                "no-irregular-whitespace": "off",
                "perfectionist/sort-exports": "off",

                "perfectionist/sort-imports": "off",
                "regexp/no-legacy-features": "off",
                "regexp/no-missing-g-flag": "off",
                "regexp/no-useless-dollar-replacements": "off",

                "regexp/no-useless-flag": "off",
            },
        },
        {
            files: [
                "**/*.md/**/*.?([cm])[jt]s?(x)",
                "**/*.md/**/*.json",
                ...componentExtensions.map(
                    (extension) => `**/*.md/**/*.${extension}`,
                ),
            ],
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        impliedStrict: true,
                    },
                },
            },
            name: "anolilab/markdown/disables/code",
            rules: {
                "@stylistic/comma-dangle": "off",
                "@stylistic/eol-last": "off",
                "@stylistic/prefer-global/process": "off",
                "@stylistic/quote-props": "off",
                "@stylistic/semi": "off",

                "@typescript-eslint/no-require-imports": "off",
                "@typescript-eslint/no-unused-expressions": "off",

                "antfu/no-top-level-await": "off",

                "import/newline-after-import": "off",
                "import/no-commonjs": "off",

                "no-alert": "off",
                "no-console": "off",
                "no-import-assign": "off",
                "no-labels": "off",
                "no-lone-blocks": "off",
                "no-redeclare": "off",
                "no-restricted-syntax": "off",
                "no-undef": "off",
                "no-unused-expressions": "off",
                "no-unused-labels": "off",
                "no-unused-vars": "off",

                ...disableTypeChecked,

                "no-for-of-array/no-for-of-array": "off",

                "unicode-bom": "off",

                "unicorn/prefer-module": "off",
                "unicorn/prefer-string-raw": "off",

                "unused-imports/no-unused-imports": "off",
                "unused-imports/no-unused-vars": "off",

                ...overrides,
            },
        },
    ];
});
