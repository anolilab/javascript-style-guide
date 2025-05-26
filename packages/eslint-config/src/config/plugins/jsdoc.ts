import { hasPackageJsonAnyDependency } from "@visulima/package";

import type {
    OptionsFiles,
    OptionsOverrides,
    OptionsPackageJson,
    OptionsSilentConsoleLogs,
    OptionsStylistic,
    OptionsTypescript,
    TypedFlatConfigItem,
} from "../../types";
import { createConfig, getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides & OptionsPackageJson & OptionsSilentConsoleLogs & OptionsStylistic & { jsx?: boolean; typescript?: OptionsTypescript | boolean }>("js", async (config, oFiles) => {
    const {
        files = oFiles,
        jsx = false,
        overrides = {},
        packageJson,
        silent,
        stylistic = true,
        typescript,
    } = config;

    const jsdocPlugin = await interopDefault(import("eslint-plugin-jsdoc"));

    const hasTsDocumentPlugin = hasPackageJsonAnyDependency(packageJson, ["eslint-plugin-tsdoc"]);

    if (hasTsDocumentPlugin && !silent) {
        // eslint-disable-next-line no-console
        console.info("\nFound eslint-plugin-tsdoc as dependency, disabling the jsdoc rules for *.ts and *.tsx files.");
    }

    const definedTags = ["remarks", "openapi"];
    const excludeTags = ["openapi"];

    const rules: TypedFlatConfigItem[] = [
        {
            name: "anolilab/jsdoc/setup",
            plugins: {
                jsdoc: jsdocPlugin,
            },
        },
        {
            files,
            name: "anolilab/jsdoc/js-rules",
            rules: {
                ...jsdocPlugin.configs["flat/recommended-error"].rules,

                "jsdoc/check-indentation": ["error", { excludeTags }],
                "jsdoc/check-tag-names": ["error", {
                    definedTags,
                    jsxTags: jsx,
                }],

                ...overrides,

                ...stylistic
                    ? {
                        "jsdoc/check-alignment": "warn",
                        "jsdoc/multiline-blocks": "warn",
                    }
                    : {},
            },
        },
    ];

    if (typescript && !hasTsDocumentPlugin) {
        rules.push({
            files: getFilesGlobs("ts"),
            name: "anolilab/jsdoc/ts-rules",
            rules: {
                ...jsdocPlugin.configs["flat/contents-typescript-error"].rules,
                ...jsdocPlugin.configs["flat/logical-typescript-error"].rules,
                ...jsdocPlugin.configs["flat/stylistic-typescript-error"].rules,

                "jsdoc/check-indentation": ["error", { excludeTags }],
                "jsdoc/check-tag-names": ["error", {
                    definedTags,
                    jsxTags: jsx,
                }],

                ...overrides,

                ...stylistic
                    ? {
                        "jsdoc/check-alignment": "warn",
                        "jsdoc/multiline-blocks": "warn",
                    }
                    : {},
            },
        });
    }

    return rules;
});
