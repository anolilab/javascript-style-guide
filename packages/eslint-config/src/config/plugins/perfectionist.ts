import { hasPackageJsonAnyDependency } from "@visulima/package";

import type { OptionsFiles, OptionsOverrides, OptionsPackageJson } from "../../types";
import { createConfig, getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/azat-io/eslint-plugin-perfectionist
export default createConfig<OptionsFiles & OptionsOverrides & OptionsPackageJson>("all", async (config, oFiles) => {
    const { files = oFiles, overrides, packageJson } = config;

    const pluginPerfectionist = await interopDefault(import("eslint-plugin-perfectionist"));

    if (hasPackageJsonAnyDependency(packageJson, ["eslint-plugin-typescript-sort-keys"])) {
        // eslint-disable-next-line no-console
        console.warn("\nPlease remove \"eslint-plugin-typescript-sort-keys\" from your package.json, it conflicts with \"eslint-plugin-perfectionist\".\n");
    }

    return [
        {
            name: "anolilab/perfectionist/setup",
            plugins: {
                perfectionist: pluginPerfectionist,
            },
        },
        {
            files,
            name: "anolilab/perfectionist/rules",
            rules: {
                ...pluginPerfectionist.configs["recommended-natural"].rules,

                // Disabled because of sort-imports
                "perfectionist/sort-imports": "off",
                // Disabled because of simple-import-sort/exports
                "perfectionist/sort-named-exports": "off",

                // Disabled because of simple-import-sort/imports
                "perfectionist/sort-named-imports": "off",
                // Disabled because of @typescript-eslint/sort-type-constituents
                "perfectionist/sort-union-types": "off",

                ...overrides,
            },
        },
        {
            files: getFilesGlobs("ts"),
            name: "anolilab/perfectionist/typescript",
            rules: {
                // Disabled because of @typescript-eslint/member-ordering
                "perfectionist/sort-classes": "off",
            },
        },
        {
            files: getFilesGlobs("postcss"),
            name: "anolilab/perfectionist/postcss",
            rules: {
                "perfectionist/sort-objects": "off",
            },
        },
    ];
});
