import { hasPackageJsonAnyDependency } from "@visulima/package";

import type {
    OptionsFiles,
    OptionsPackageJson,
    OptionsSilentConsoleLogs,
    OptionsStylistic,
    TypedFlatConfigItem,
} from "../../types";
import { createConfig, getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsPackageJson & OptionsSilentConsoleLogs & OptionsStylistic>("js", async (config, oFiles) => {
    const {
        files = oFiles,
        packageJson,
        silent,
        stylistic = true,
    } = config;

    const jsdocPlugin = await interopDefault(import("eslint-plugin-jsdoc"));

    const hasTypescript = hasPackageJsonAnyDependency(packageJson, ["typescript"]);
    const hasTsDocumentPlugin = hasPackageJsonAnyDependency(packageJson, ["eslint-plugin-tsdoc"]);

    if (hasTsDocumentPlugin && !silent) {
        // eslint-disable-next-line no-console
        console.info("\nFound eslint-plugin-tsdoc as dependency, disabling the jsdoc rules for *.ts and *.tsx files.");
    }

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

                ...stylistic
                    ? {
                        "jsdoc/check-alignment": "warn",
                        "jsdoc/multiline-blocks": "warn",
                    }
                    : {},
            },
        },
    ];

    if (hasTypescript && !hasTsDocumentPlugin) {
        rules.push({
            files: getFilesGlobs("ts"),
            name: "anolilab/jsdoc/ts-rules",
            rules: {
                ...jsdocPlugin.configs["flat/contents-typescript-error"].rules,
                ...jsdocPlugin.configs["flat/logical-typescript-error"].rules,
                ...jsdocPlugin.configs["flat/stylistic-typescript-error"].rules,

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
