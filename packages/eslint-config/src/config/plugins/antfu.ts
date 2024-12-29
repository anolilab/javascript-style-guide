import { createConfig } from "../../utils/create-config";
import type { OptionsFiles, OptionsOverrides, OptionsPackageJson } from "../../types";
import interopDefault from "../../utils/interop-default";
import { hasPackageJsonAnyDependency } from "@visulima/package";

export default createConfig<
    OptionsOverrides &
        OptionsFiles &
        OptionsPackageJson & {
            lessOpinionated?: boolean;
        }
>("all", async (config, oFiles) => {
    const { files = oFiles, overrides, packageJson, lessOpinionated = false } = config;

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
                "antfu/no-import-dist": "error",
                "antfu/no-import-node-modules-by-path": "error",

                "antfu/no-ts-export-equal": hasPackageJsonAnyDependency(packageJson, ["typescript"]) ? "error" : "off",

                "antfu/if-newline": "error",
                "antfu/prefer-inline-type-import": "off",
                "antfu/top-level-function": "off",

                "antfu/consistent-chaining": "error",
                "antfu/consistent-list-newline": "error",

                ...(lessOpinionated
                    ? {
                          curly: ["error", "all"],
                      }
                    : {
                          "antfu/curly": "error",
                          "antfu/if-newline": "error",
                          "antfu/top-level-function": "error",
                      }),

                ...overrides,
            },
        },
    ];
});
