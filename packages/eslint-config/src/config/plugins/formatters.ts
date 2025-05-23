import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem } from "../../types";
import { getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import parserPlain from "../../utils/parser-plain";
import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from "../../vender/prettier-types";
import { StylisticConfigDefaults } from "./stylistic";

const mergePrettierOptions = (options: VendoredPrettierOptions, overrides: VendoredPrettierRuleOptions = {}): VendoredPrettierRuleOptions => {
    return {
        ...options,
        ...overrides,
        plugins: [...overrides.plugins || [], ...options.plugins || []],
    };
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const formatters = async (options: OptionsFormatters, stylistic: StylisticConfig): Promise<TypedFlatConfigItem[]> => {
    if (options.slidev && options.markdown !== true && options.markdown !== "prettier") {
        throw new Error("`slidev` option only works when `markdown` is enabled with `prettier`");
    }

    const { indent, quotes, semi } = {
        ...StylisticConfigDefaults,
        ...stylistic,
    };

    const prettierOptions: VendoredPrettierOptions = Object.assign(
        {
            endOfLine: "auto",
            printWidth: 120,
            semi,
            singleQuote: quotes === "single",
            tabWidth: typeof indent === "number" ? indent : 2,
            trailingComma: "all",
            useTabs: indent === "tab",
        } satisfies VendoredPrettierOptions,
        options.prettierOptions || {},
    );

    const prettierXmlOptions: VendoredPrettierOptions = {
        xmlQuoteAttributes: "double",
        xmlSelfClosingSpace: true,
        xmlSortAttributesByKey: false,
        xmlWhitespaceSensitivity: "ignore",
    };

    const dprintOptions = {
        indentWidth: typeof indent === "number" ? indent : 2,
        quoteStyle: quotes === "single" ? "preferSingle" : "preferDouble",
        useTabs: indent === "tab",
        ...options.dprintOptions,
    };

    const pluginFormat = await interopDefault(import("eslint-plugin-format"));

    const configs: TypedFlatConfigItem[] = [
        {
            name: "anolilab/formatter/setup",
            plugins: {
                format: pluginFormat,
            },
        },
    ];

    if (options.css) {
        configs.push(
            {
                files: [...getFilesGlobs("css"), ...getFilesGlobs("postcss")],
                languageOptions: {
                    parser: parserPlain,
                },
                name: "anolilab/formatter/css",
                rules: {
                    "format/prettier": [
                        "error",
                        mergePrettierOptions(prettierOptions, {
                            parser: "css",
                        }),
                    ],
                },
            },
            {
                files: getFilesGlobs("scss"),
                languageOptions: {
                    parser: parserPlain,
                },
                name: "anolilab/formatter/scss",
                rules: {
                    "format/prettier": [
                        "error",
                        mergePrettierOptions(prettierOptions, {
                            parser: "scss",
                        }),
                    ],
                },
            },
            {
                files: getFilesGlobs("less"),
                languageOptions: {
                    parser: parserPlain,
                },
                name: "anolilab/formatter/less",
                rules: {
                    "format/prettier": [
                        "error",
                        mergePrettierOptions(prettierOptions, {
                            parser: "less",
                        }),
                    ],
                },
            },
        );
    }

    if (options.html) {
        configs.push({
            files: getFilesGlobs("html"),
            languageOptions: {
                parser: parserPlain,
            },
            name: "anolilab/formatter/html",
            rules: {
                "format/prettier": [
                    "error",
                    mergePrettierOptions(prettierOptions, {
                        parser: "html",
                    }),
                ],
            },
        });
    }

    if (options.xml) {
        configs.push({
            files: getFilesGlobs("xml"),
            languageOptions: {
                parser: parserPlain,
            },
            name: "anolilab/formatter/xml",
            rules: {
                "format/prettier": [
                    "error",
                    mergePrettierOptions(
                        { ...prettierXmlOptions, ...prettierOptions },
                        {
                            parser: "xml",
                            plugins: ["@prettier/plugin-xml"],
                        },
                    ),
                ],
            },
        });
    }

    if (options.svg) {
        configs.push({
            files: getFilesGlobs("svg"),
            languageOptions: {
                parser: parserPlain,
            },
            name: "anolilab/formatter/svg",
            rules: {
                "format/prettier": [
                    "error",
                    mergePrettierOptions(
                        { ...prettierXmlOptions, ...prettierOptions },
                        {
                            parser: "xml",
                            plugins: ["@prettier/plugin-xml"],
                        },
                    ),
                ],
            },
        });
    }

    if (options.markdown) {
        const formater = options.markdown === true ? "prettier" : options.markdown;

        let GLOB_SLIDEV: string[] = [];

        if (typeof options.slidev === "boolean" && options.slidev === true) {
            GLOB_SLIDEV = ["**/slides.md"];
        } else if (typeof options.slidev === "object" && options.slidev.files) {
            GLOB_SLIDEV = options.slidev.files;
        }

        configs.push({
            files: getFilesGlobs("markdown"),
            ignores: GLOB_SLIDEV,
            languageOptions: {
                parser: parserPlain,
            },
            name: "anolilab/formatter/markdown",
            rules: {
                [`format/${formater}`]: [
                    "error",
                    formater === "prettier"
                        ? mergePrettierOptions(prettierOptions, {
                            embeddedLanguageFormatting: "off",
                            parser: "markdown",
                        })
                        : {
                            ...dprintOptions,
                            language: "markdown",
                        },
                ],
            },
        });

        if (options.slidev) {
            configs.push({
                files: GLOB_SLIDEV,
                languageOptions: {
                    parser: parserPlain,
                },
                name: "anolilab/formatter/slidev",
                rules: {
                    "format/prettier": [
                        "error",
                        mergePrettierOptions(prettierOptions, {
                            embeddedLanguageFormatting: "off",
                            parser: "slidev",
                            plugins: ["prettier-plugin-slidev"],
                        }),
                    ],
                },
            });
        }
    }

    if (options.astro) {
        configs.push(
            {
                files: getFilesGlobs("astro"),
                languageOptions: {
                    parser: parserPlain,
                },
                name: "anolilab/formatter/astro",
                rules: {
                    "format/prettier": [
                        "error",
                        mergePrettierOptions(prettierOptions, {
                            parser: "astro",
                            plugins: ["prettier-plugin-astro"],
                        }),
                    ],
                },
            },
            {
                files: [...getFilesGlobs("astro"), ...getFilesGlobs("astro_ts")],
                name: "anolilab/formatter/astro/disables",
                rules: {
                    "@stylistic/arrow-parens": "off",
                    "@stylistic/block-spacing": "off",
                    "@stylistic/comma-dangle": "off",
                    "@stylistic/indent": "off",
                    "@stylistic/no-multi-spaces": "off",
                    "@stylistic/quotes": "off",
                    "@stylistic/semi": "off",
                },
            },
        );
    }

    if (options.graphql) {
        configs.push({
            files: getFilesGlobs("graphql"),
            languageOptions: {
                parser: parserPlain,
            },
            name: "anolilab/formatter/graphql",
            rules: {
                "format/prettier": [
                    "error",
                    mergePrettierOptions(prettierOptions, {
                        parser: "graphql",
                    }),
                ],
            },
        });
    }

    return configs;
};

export default formatters;
