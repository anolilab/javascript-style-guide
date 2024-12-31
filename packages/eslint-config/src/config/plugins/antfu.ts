import { hasPackageJsonAnyDependency } from "@visulima/package";

import type { OptionsFiles, OptionsOverrides, OptionsPackageJson } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<
    OptionsFiles &
    OptionsOverrides &
    OptionsPackageJson & {
        lessOpinionated?: boolean;
    }
>("all", async (config, oFiles) => {
    const {
        files = oFiles,
        lessOpinionated = false,
        overrides,
        packageJson,
    } = config;

    const antfuPlugin = await interopDefault(import("eslint-plugin-antfu"));

    return [
        {
            files,
            name: "anolilab/antfu",
            plugins: {
                antfu: antfuPlugin,
            },
            rules: {
                "antfu/consistent-chaining": "error",
                "antfu/consistent-list-newline": "error",
                "antfu/if-newline": "error",

                "antfu/import-dedupe": "error",

                "antfu/no-import-dist": "error",
                "antfu/no-import-node-modules-by-path": "error",
                "antfu/no-ts-export-equal": hasPackageJsonAnyDependency(packageJson, ["typescript"]) ? "error" : "off",

                "antfu/prefer-inline-type-import": "off",
                "antfu/top-level-function": "off",

                ...lessOpinionated
                    ? {
                        curly: ["error", "all"],
                    }
                    : {
                        "antfu/curly": "error",
                        "antfu/if-newline": "error",
                    },

                ...overrides,
            },
        },
    ];
});
