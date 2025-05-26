import type {
    OptionsFiles,
    OptionsOverrides,
    OptionsStylistic,
    TypedFlatConfigItem,
} from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides & OptionsStylistic>("astro", async (config, oFiles): Promise<TypedFlatConfigItem[]> => {
    const { files = oFiles, overrides = {}, stylistic = true } = config;

    const [pluginAstro, parserAstro, parserTs] = await Promise.all([
        interopDefault(import("eslint-plugin-astro")),
        interopDefault(import("astro-eslint-parser")),
        interopDefault(import("@typescript-eslint/parser")),
    ] as const);

    return [
        {
            name: "anolilab/astro/setup",
            plugins: {
                astro: pluginAstro,
            },
        },
        {
            files,
            languageOptions: {
                globals: pluginAstro.environments.astro.globals,
                parser: parserAstro,
                parserOptions: {
                    extraFileExtensions: [".astro"],
                    parser: parserTs,
                },
                sourceType: "module",
            },
            name: "anolilab/astro/rules",
            processor: "astro/client-side-ts",
            rules: {
                // Astro uses top level await for e.g. data fetching
                // https://docs.astro.build/en/guides/data-fetching/#fetch-in-astro
                "antfu/no-top-level-await": "off",

                // use recommended rules
                "astro/missing-client-only-directive-value": "error",
                "astro/no-conflict-set-directives": "error",
                "astro/no-deprecated-astro-canonicalurl": "error",
                "astro/no-deprecated-astro-fetchcontent": "error",
                "astro/no-deprecated-astro-resolve": "error",
                "astro/no-deprecated-getentrybyslug": "error",
                "astro/no-set-html-directive": "off",
                "astro/no-unused-define-vars-in-style": "error",
                "astro/semi": "off",
                "astro/valid-compile": "error",

                ...stylistic
                    ? {
                        "@stylistic/indent": "off",
                        "@stylistic/jsx-closing-tag-location": "off",
                        "@stylistic/jsx-one-expression-per-line": "off",
                        "@stylistic/no-multiple-empty-lines": "off",
                    }
                    : {},

                ...overrides,
            },
        },
    ];
});
