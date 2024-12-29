import { createConfig } from "../../utils/create-config";
import type { OptionsFiles, OptionsHasPrettier, OptionsOverrides, OptionsStylistic } from "../../types";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsOverrides & OptionsFiles & OptionsHasPrettier & OptionsStylistic>("html", async (config, oFiles) => {
    const { files = oFiles, overrides, prettier, stylistic = true } = config;

    const { indent = 4 } = typeof stylistic === "boolean" ? {} : stylistic;

    const htmlPlugin = await interopDefault(import("eslint-plugin-html"));

    return [
        {
            name: "anolilab/html/setup",
            files,
            plugins: {
                html: htmlPlugin,
            },
            rules: {
                "@html-eslint/indent": ["error", indent],
                "capitalized-comments": "off",
                // @see https://github.com/yeonjuan/html-eslint/issues/67 bug in html-eslint
                "spaced-comment": "off",

                ...(prettier
                    ? {
                          "@html-eslint/element-newline": "off",
                          "@html-eslint/indent": "off",
                          "@html-eslint/no-extra-spacing-attrs": "off",
                          "@html-eslint/quotes": "off",
                      }
                    : {}),

                ...overrides,
            },

            settings: {
                "html/report-bad-indent": "error",
                "html/indent": `+${indent}`,
                ...(prettier ? { "html/report-bad-indent": "off" } : {}),
            },
        },
    ];
});
