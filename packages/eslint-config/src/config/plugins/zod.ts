import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>(
    "all",
    async (config, oFiles) => {
        const { files = oFiles, overrides } = config;

        const zodPlugin = await interopDefault(import("eslint-plugin-zod"));

        return [
            {

                ...zodPlugin.configs.recommended,
                files,
                name: "anolilab/zod/rules",
                rules: {

                    ...zodPlugin.configs.recommended.rules,
                    ...overrides,
                },
            },
        ];
    },
);
