import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<
    OptionsFiles & OptionsOverrides & { tailwind?: boolean }
>("css", async (config, oFiles) => {
    const { files = oFiles, overrides, tailwind } = config;

    const cssPlugin = await interopDefault(import("@eslint/css"));
    let tailwindCustomSyntax;

    if (tailwind) {
        tailwindCustomSyntax = await interopDefault(import("tailwind-csstree"));
    }

    return [
        {
            files,
            language: "css/css",
            name: "anolilab/css/setup",
            plugins: {
                css: cssPlugin,
            },
            rules: {
                "@stylistic/indent": "off",
                "css/no-duplicate-imports": "error",
                "css/no-empty-blocks": "error",
                "css/no-important": "error",
                "css/no-invalid-at-rules": "error",
                "css/no-invalid-properties": "error",
                "css/use-baseline": "warn",
                "css/use-layers": "error",
                // Disable JS-core rules for CSS language to avoid parser mismatch errors
                "no-irregular-whitespace": "off",
                "no-useless-assignment": "off",

                ...overrides,
            },

            ...tailwind && tailwindCustomSyntax
                ? {
                    languageOptions: {
                        customSyntax: tailwindCustomSyntax.tailwind4,
                        tolerant: true,
                    },
                }
                : {},
        },
    ];
});
