import { createConfig, getFilesGlobs } from "../../utils/create-config";
import type { OptionsFiles, OptionsOverrides, OptionsPackageJson } from "../../types";
import interopDefault from "../../utils/interop-default";
import { hasPackageJsonAnyDependency } from "@visulima/package";

// @see https://github.com/azat-io/eslint-plugin-perfectionist
export default createConfig<OptionsOverrides & OptionsFiles & OptionsPackageJson>("all", async (config, oFiles) => {
    const { files = oFiles, overrides, packageJson } = config;

    const pluginPerfectionist = await interopDefault(import("eslint-plugin-perfectionist"));

    if (hasPackageJsonAnyDependency(packageJson, ["eslint-plugin-typescript-sort-keys"])) {
        console.warn('\nPlease remove "eslint-plugin-typescript-sort-keys" from your package.json, it conflicts with "eslint-plugin-perfectionist".\n')
    }

    return [
        {
            name: "anolilab/perfectionist/setup",
            plugins: {
                perfectionist: pluginPerfectionist,
            },
        },
        {
            name: "anolilab/perfectionist/rules",
            files,
            rules: {
                ...pluginPerfectionist.configs["recommended-natural"].rules,

                // Disabled because of sort-imports
                "perfectionist/sort-imports": "off",
                // Disabled because of @typescript-eslint/sort-type-constituents
                "perfectionist/sort-union-types": "off",

                // Disabled because of simple-import-sort/imports
                "perfectionist/sort-named-imports": "off",
                // Disabled because of simple-import-sort/exports
                "perfectionist/sort-named-exports": "off",

                ...overrides,
            },
        },
        {
            name: "anolilab/perfectionist/typescript",
            files: getFilesGlobs("ts"),
            rules: {
                // Disabled because of @typescript-eslint/member-ordering
                "perfectionist/sort-classes": "off",
            },
        },
        {
            name: "anolilab/perfectionist/postcss",
            files: getFilesGlobs("postcss"),
            rules: {
                "perfectionist/sort-objects": "off",
            },
        },
    ];
});
