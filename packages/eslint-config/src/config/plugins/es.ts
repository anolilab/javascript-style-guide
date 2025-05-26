import type { OptionsFiles } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles>("all", async (config, oFiles) => {
    const { files = oFiles } = config;

    const pluginES = await interopDefault(import("eslint-plugin-es-x"));

    return [
        {
            files,
            name: "anolilab/es/setup",
            plugins: {
                "es-x": pluginES,
            },
        },
    ];
});
