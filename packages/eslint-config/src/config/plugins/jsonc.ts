import { hasAnyDep } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

const extendedPlugins: string[] = [];

if (
    hasAnyDep(["prettier"], {
        peerDeps: false,
    })
) {
    extendedPlugins.push("plugin:jsonc/prettier");
}

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.json", "*.json5", "*.jsonc"],
            extends: extendedPlugins,
            parser: "jsonc-eslint-parser",
        },
        {
            files: ["*.json5"],
            extends: ["plugin:jsonc/recommended-with-json5"],
        },
        {
            files: ["*.jsonc"],
            extends: ["plugin:jsonc/recommended-with-jsonc"],
        },
        {
            files: ["*.json"],
            extends: ["plugin:jsonc/recommended-with-json"],
            rules: {
                "jsonc/sort-keys": [
                    "error",
                    {
                        pathPattern: "^$",
                        order: [
                            "publisher",
                            "name",
                            "displayName",
                            "type",
                            "version",
                            "private",
                            "packageManager",
                            "description",
                            "author",
                            "license",
                            "funding",
                            "homepage",
                            "repository",
                            "bugs",
                            "keywords",
                            "categories",
                            "sideEffects",
                            "exports",
                            "main",
                            "module",
                            "unpkg",
                            "jsdelivr",
                            "types",
                            "typesVersions",
                            "bin",
                            "icon",
                            "files",
                            "engines",
                            "activationEvents",
                            "contributes",
                            "scripts",
                            "peerDependencies",
                            "peerDependenciesMeta",
                            "dependencies",
                            "optionalDependencies",
                            "devDependencies",
                            "pnpm",
                            "overrides",
                            "resolutions",
                            "husky",
                            "simple-git-hooks",
                            "lint-staged",
                            "eslintConfig",
                        ],
                    },
                    {
                        pathPattern: "^(?:dev|peer|optional|bundled)?[Dd]ependencies$",
                        order: { type: "asc" },
                    },
                    {
                        pathPattern: "^exports.*$",
                        order: ["types", "require", "import"],
                    },
                ],
            },
        },
    ],
};

export default config;
