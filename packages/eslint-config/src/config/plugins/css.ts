import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides & { tailwind?: boolean }>("css", async (config, oFiles) => {
    const { files = oFiles, overrides, tailwind } = config;

    const cssPlugin = await interopDefault(import("@eslint/css"));
    const cssSyntax = await interopDefault(import("@eslint/css/syntax"));

    return [{
        files,
        language: "css/css",
        name: "anolilab/css/setup",
        plugins: {
            css: cssPlugin,
        },
        rules: {
            "css/no-duplicate-imports": "error",
            "css/no-empty-blocks": "error",
            "css/no-important": "error",
            "css/no-invalid-at-rules": "error",
            "css/no-invalid-properties": "error",
            "css/use-baseline": "warn",
            "css/use-layers": "error",

            ...overrides,
        },

        ...tailwind
            ? {
                languageOptions: {
                    customSyntax: cssSyntax.tailwindSyntax,
                    tolerant: true,
                },
            }
            : {},
    }];
});
