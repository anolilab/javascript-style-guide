import globals from "globals";

import type { OptionsPackageJson } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsPackageJson>("js", async (config) => {
    const { packageJson } = config;

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
                    ...packageJson.type === "module"
                        ? {
                            __dirname: "off",
                            __filename: "off",
                            exports: "off",
                            require: "off",
                        }
                        : {
                            __dirname: true,
                            __filename: true,
                            exports: true,
                            require: true,
                        },
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
        {
            files: ["**/*.cjs"],
            languageOptions: {
                // inside *.cjs files. restore commonJS "globals"
                globals: {
                    __dirname: true,
                    __filename: true,
                    exports: true,
                    require: true,
                },
            },
        },
        {
            files: ["**/*.mjs"],
            languageOptions: {
                globals: {
                    __dirname: "off",
                    __filename: "off",
                    exports: "off",
                    require: "off",
                },
            },
        },
    ];
});
