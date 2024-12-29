import { createConfig } from "../../utils/create-config";
import type { OptionsFiles, OptionsOverrides } from "../../types";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
export default createConfig<OptionsFiles & OptionsOverrides>("jsx_and_tsx", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const validateJsxNestingPlugin = await interopDefault(import("eslint-plugin-validate-jsx-nesting"));

    return [
        {
            name: "anolilab/validate-jsx-nesting/setup",
            files,
            plugins: {
                "validate-jsx-nesting": validateJsxNestingPlugin,
            },
            rules: {
                "validate-jsx-nesting/no-invalid-jsx-nesting": "error",

                ...overrides,
            },
        },
    ];
});
