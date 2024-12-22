import { createConfig } from "../../utils/create-config";
import type { OptionsFiles, OptionsOverrides, OptionsPackageJson } from "../../types";
import interopDefault from "../../utils/interop-default";
import { hasPackageJsonAnyDependency } from "@visulima/package";

export default createConfig<OptionsOverrides & OptionsFiles & OptionsPackageJson>("all", async (config, oFiles) => {
    const { files = oFiles, overrides, packageJson } = config;

    const antfuPlugin = await interopDefault(import("eslint-plugin-antfu"));

    return [
        {
            files,
            name: "anolilab/antfu",
            plugins: {
                antfu: antfuPlugin,
            },
            rules: {
                "antfu/import-dedupe": "error",
                "ntfu/no-import-dist": "error",
                "antfu/no-import-node-modules-by-path": "error",

                "antfu/generic-spacing": "error",

                "antfu/no-cjs-exports": packageJson.type === "module" ? "error" : "off",
                "antfu/no-ts-export-equal": hasPackageJsonAnyDependency(packageJson, ["typescript"]) ? "error" : "off",

                "antfu/if-newline": "error",
                "antfu/prefer-inline-type-import": "off",
                "antfu/top-level-function": "off",

                ...overrides,
            },
        },
    ];
});
