import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/mozilla/eslint-plugin-no-unsanitized
export default createConfig<OptionsFiles & OptionsOverrides>("js", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const noUnsanitizedPlugin = await interopDefault(import("eslint-plugin-no-unsanitized"));

    return [
        {
            files,
            name: "anolilab/no-unsanitized/setup",
            plugins: {
                "no-unsanitized": noUnsanitizedPlugin,
            },
            rules: {
                "no-unsanitized/method": "error",
                "no-unsanitized/property": "error",

                ...overrides,
            },
        },
    ];
});
