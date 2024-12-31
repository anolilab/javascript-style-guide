import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginSimpleImportSort = await interopDefault(import("eslint-plugin-simple-import-sort"));

    return [
        {
            files,
            name: "anolilab/simple-import-sort",
            plugins: {
                "simple-import-sort": pluginSimpleImportSort,
            },
            rules: {
                "simple-import-sort/exports": "error",
                "simple-import-sort/imports": "error",

                ...overrides,
            },
        },
    ];
});
