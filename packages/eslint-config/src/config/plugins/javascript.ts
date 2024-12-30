import { createConfig } from "../../utils/create-config";

import globals from "globals";
import interopDefault from "../../utils/interop-default";

export default createConfig("js", async () => {
    const eslintJs = await interopDefault(import("@eslint/js"));

    return [
        {
            languageOptions: {
                ecmaVersion: 2022,
                globals: {
                    ...globals.browser,
                    ...globals.es2021,
                    ...globals.node,
                    document: "readonly",
                    navigator: "readonly",
                    window: "readonly",
                },
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                    },
                    ecmaVersion: 2022,
                    sourceType: "module",
                },
                sourceType: "module",
            },
            linterOptions: {
                reportUnusedDisableDirectives: true,
            },
            name: "anolilab/javascript/setup",
        },
        eslintJs.configs.recommended,
    ];
});
