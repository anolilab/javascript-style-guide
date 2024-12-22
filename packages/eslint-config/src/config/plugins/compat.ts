import { createConfig } from "../../utils/create-config";
import type { OptionsFiles } from "../../types";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles>("all", async (config, oFiles) => {
    const { files = oFiles } = config;

    const compatPlugin = await interopDefault(import("eslint-plugin-compat"));

    const fConfig = compatPlugin.configs["flat/recommended"];

    fConfig.files = files;

    return [fConfig];
});
