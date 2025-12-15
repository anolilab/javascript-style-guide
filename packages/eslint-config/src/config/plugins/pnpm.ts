import { findUp } from "@visulima/fs";
import { readYaml } from "@visulima/fs/yaml";

import type {
    OptionsFiles,
    OptionsIsInEditor,
    OptionsOverrides,
    OptionsPnpm,
    TypedFlatConfigItem,
} from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

const detectCatalogUsage = async (): Promise<boolean> => {
    const workspaceFile = await findUp("pnpm-workspace.yaml");

    if (!workspaceFile) {
        return false;
    }

    try {
        const yaml = await readYaml(workspaceFile);

        return "catalog" in yaml || "catalogs" in yaml;
    } catch {
        return false;
    }
};

export default createConfig<
    OptionsFiles & OptionsIsInEditor & OptionsOverrides & OptionsPnpm
>("all", async (options) => {
    const { catalogs = await detectCatalogUsage(), isInEditor = false, json = true, sort = true, yaml = true }
        = options;

    const [yamlParser, pluginYaml, pluginPnpm, jsoncParser] = await Promise.all([
        interopDefault(import("yaml-eslint-parser")),
        interopDefault(import("eslint-plugin-yml")),
        interopDefault(import("eslint-plugin-pnpm")),
        interopDefault(import("jsonc-eslint-parser")),
    ] as const);

    const configs: TypedFlatConfigItem[] = [];

    if (json) {
        configs.push(
            {
                files: [
                    "package.json",
                    "**/package.json",
                ],
                languageOptions: {
                    parser: jsoncParser,
                },
                name: "antfu/pnpm/package-json",
                plugins: {
                    pnpm: pluginPnpm,
                },
                rules: {
                    ...catalogs
                        ? {
                            "pnpm/json-enforce-catalog": [
                                "error",
                                { autofix: !isInEditor },
                            ],
                        }
                        : {},
                    "pnpm/json-prefer-workspace-settings": [
                        "error",
                        { autofix: !isInEditor },
                    ],
                    "pnpm/json-valid-catalog": [
                        "error",
                        { autofix: !isInEditor },
                    ],
                },
            },
        );
    }

    if (yaml) {
        configs.push({
            files: ["pnpm-workspace.yaml"],
            languageOptions: {
                parser: yamlParser,
            },
            name: "antfu/pnpm/pnpm-workspace-yaml",
            plugins: {
                pnpm: pluginPnpm,
            },
            rules: {
                "pnpm/yaml-enforce-settings": ["error", {
                    settings: {
                        catalogMode: "prefer",
                        shellEmulator: true,
                        trustPolicy: "no-downgrade",
                    },
                }],
                "pnpm/yaml-no-duplicate-catalog-item": "error",
                "pnpm/yaml-no-unused-catalog-item": "error",
            },
        });

        if (sort) {
            configs.push({
                files: ["pnpm-workspace.yaml"],
                languageOptions: {
                    parser: yamlParser,
                },
                name: "antfu/pnpm/pnpm-workspace-yaml-sort",
                plugins: {
                    yaml: pluginYaml,
                },
                rules: {
                    "yaml/sort-keys": [
                        "error",
                        {
                            order: [
                                // Settings
                                // @keep-sorted

                                "cacheDir",
                                "catalogMode",
                                "cleanupUnusedCatalogs",
                                "dedupeDirectDeps",
                                "deployAllFiles",
                                "enablePrePostScripts",
                                "engineStrict",
                                "extendNodePath",
                                "hoist",
                                "hoistPattern",
                                "hoistWorkspacePackages",
                                "ignoreCompatibilityDb",
                                "ignoreDepScripts",
                                "ignoreScripts",
                                "ignoreWorkspaceRootCheck",
                                "managePackageManagerVersions",
                                "minimumReleaseAge",
                                "minimumReleaseAgeExclude",
                                "modulesDir",
                                "nodeLinker",
                                "nodeVersion",
                                "optimisticRepeatInstall",
                                "packageManagerStrict",
                                "packageManagerStrictVersion",
                                "preferSymlinkedExecutables",
                                "preferWorkspacePackages",
                                "publicHoistPattern",
                                "registrySupportsTimeField",
                                "requiredScripts",
                                "resolutionMode",
                                "savePrefix",
                                "scriptShell",
                                "shamefullyHoist",
                                "shellEmulator",
                                "stateDir",
                                "supportedArchitectures",
                                "symlink",
                                "tag",
                                "trustPolicy",
                                "trustPolicyExclude",
                                "updateNotifier",

                                // Packages and dependencies
                                "packages",
                                "overrides",
                                "patchedDependencies",
                                "catalog",
                                "catalogs",

                                // Other
                                // @keep-sorted

                                "allowedDeprecatedVersions",
                                "allowNonAppliedPatches",
                                "configDependencies",
                                "ignoredBuiltDependencies",
                                "ignoredOptionalDependencies",
                                "neverBuiltDependencies",
                                "onlyBuiltDependencies",
                                "onlyBuiltDependenciesFile",
                                "packageExtensions",
                                "peerDependencyRules",
                            ],
                            pathPattern: "^$",
                        },
                        {
                            order: { type: "asc" },
                            pathPattern: ".*",
                        },
                    ],
                },
            });
        }
    }

    return configs;
});
