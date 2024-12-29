import { createConfig } from "../../utils/create-config";
import type { OptionsFiles, OptionsOverrides } from "../../types";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsOverrides & OptionsFiles>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginSimpleImportSort = await interopDefault(import("eslint-plugin-simple-import-sort"));

    return [
        {
            name: "anolilab/simple-import-sort",
            files,
            plugins: {
                "simple-import-sort": pluginSimpleImportSort,
            },
            rules: {
                "simple-import-sort/imports": "error",
                "simple-import-sort/exports": "error",

                ...overrides,
            },
        },
    ];
});
