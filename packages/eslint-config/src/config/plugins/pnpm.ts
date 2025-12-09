import type {
    OptionsFiles,
    OptionsIsInEditor,
    OptionsOverrides,
} from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<
    OptionsFiles & OptionsIsInEditor & OptionsOverrides
>("all", async (options) => {
    const { isInEditor = false } = options;

    const [parserYaml, pluginPnpm, jsoncParser] = await Promise.all([
        interopDefault(import("yaml-eslint-parser")),
        interopDefault(import("eslint-plugin-pnpm")),
        interopDefault(import("jsonc-eslint-parser")),
    ] as const);

    return [
        {
            files: ["package.json", "**/package.json"],
            languageOptions: {
                parser: jsoncParser,
            },
            name: "anolilab/pnpm/package-json",
            plugins: {
                pnpm: pluginPnpm,
            },
            rules: {
                "pnpm/json-enforce-catalog": [
                    "error",
                    { autofix: !isInEditor },
                ],
                "pnpm/json-prefer-workspace-settings": [
                    "error",
                    { autofix: !isInEditor },
                ],
                "pnpm/json-valid-catalog": ["error", { autofix: !isInEditor }],
            },
        },
        {
            files: ["pnpm-workspace.yaml"],
            languageOptions: {
                parser: parserYaml,
            },
            name: "anolilab/pnpm/pnpm-workspace-yaml",
            plugins: {
                pnpm: pluginPnpm,
            },
            rules: {
                "pnpm/yaml-enforce-settings": [
                    "error",
                    {
                        settings: {
                            catalogMode: "prefer",
                            cleanupUnusedCatalogs: true,
                            shellEmulator: true,
                            trustPolicy: "no-downgrade",
                        },
                    },
                ],
                "pnpm/yaml-no-duplicate-catalog-item": "error",
                "pnpm/yaml-no-unused-catalog-item": "error",
            },
        },
        {
            files: ["pnpm-workspace.yaml"],
            name: "anolilab/yaml/pnpm-workspace",
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
        },
    ];
});
