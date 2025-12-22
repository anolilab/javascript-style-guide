import type { NormalizedPackageJson, PackageManager } from "@visulima/package";
import { hasPackageJsonAnyDependency } from "@visulima/package";

import type { EslintConfig } from "../types";
import getNearestConfigPath from "../utils/get-nearest-config-path";
import groupFilePathsByDirectoryName from "./group-file-paths-by-directory-name";
import removeIgnoredFiles from "./remove-ignored-files";

const configFile = ".eslintrc";

const createEslintArguments = (
    eslintConfig: EslintConfig,
    packageJson: NormalizedPackageJson,
): string[] => {
    const eslintArguments: string[] = [];

    if (
        eslintConfig["max-warnings"] !== undefined
        && Number.isNaN(eslintConfig["max-warnings"])
    ) {
        eslintArguments.push(`--max-warnings=${eslintConfig["max-warnings"]}`);
    } else if (eslintConfig["max-warnings"] !== false) {
        eslintArguments.push("--max-warnings=0");
    }

    const extraRules = [];

    if (
        hasPackageJsonAnyDependency(packageJson, ["eslint-plugin-react-hooks"])
    ) {
        // react-hooks/eslint and react in general is very strict about exhaustively
        // declaring the dependencies when using the useEffect, useCallback... hooks.
        //
        // In some specific scenarios declaring the deps seems 'less' wanted or 'less' applicable
        // by the developer, leading to some exceptions in the code. That said it should be avoided.
        //
        // While the 'react-hooks/exhaustive-deps' rule is a good rule of thumb, it's not recommended to
        // automatically fix it from lint-staged as it can potentially break a legit intent.
        //
        // Reminder that a good practice is to always declare the dependencies when using the hooks,
        // and if not applicable, add an eslint disable comment to the useEffect, useCallback... such as:
        //
        //    // eslint-disable-next-line react-hooks/exhaustive-deps
        //
        // Another approach can be to use hooks such as https://github.com/kentcdodds/use-deep-compare-effect to quickly bypass
        // shallow rendering limitations.
        //
        // @see https://reactjs.org/docs/hooks-rules.html
        // @see https://eslint.org/docs/2.13.1/user-guide/configuring#disabling-rules-with-inline-comments
        extraRules.push("react-hooks/exhaustive-deps:off");
    }

    if (
        hasPackageJsonAnyDependency(packageJson, [
            "eslint-plugin-eslint-comments",
        ])
        // isPackageAvailable("eslint-plugin-eslint-comments")
    ) {
        extraRules.push("eslint-comments/no-unused-disable:off");
    }

    const rules = [...eslintConfig.rules ?? [], ...extraRules].filter(
        (rule) => rule.trim().length > 0,
    );

    if (rules.length > 0) {
        eslintArguments.push(rules.map((rule) => `--rule "${rule}"`).join(" "));
    }

    // For lint-staged it's safer to not apply the fix command if it changes the AST
    // @see https://eslint.org/docs/user-guide/command-line-interface#--fix-type
    const fixType = [...eslintConfig["fix-type"] ?? ["layout"]].filter(
        (type) => type.trim().length > 0,
    );

    if (fixType.length > 0) {
        eslintArguments.push(`--fix-type ${fixType.join(",")}`, "--fix");
    }

    if (eslintConfig.cache) {
        eslintArguments.push("--cache");
    }

    return eslintArguments;
};

const createEslintCommands = async (
    packageManager: PackageManager,
    packageJson: NormalizedPackageJson,
    eslintConfig: EslintConfig,
    filenames: string[],
): Promise<string[]> => {
    const filteredFiles = await removeIgnoredFiles(filenames);

    const eslintArguments = createEslintArguments(eslintConfig, packageJson);

    if (eslintConfig.config) {
        eslintArguments.push(`--config ${eslintConfig.config}`);

        return [
            `${packageManager} exec eslint ${eslintArguments.join(" ")} ${filteredFiles.join(" ")}`,
        ];
    }

    const groupedFilesNames = groupFilePathsByDirectoryName(filteredFiles);
    const eslintCommands: string[] = [];

    Object.values(groupedFilesNames).forEach((filePaths) => {
        let config: string | undefined;

        [
            configFile,
            `${configFile}.js`,
            `${configFile}.cjs`,
            `${configFile}.json`,
            `${configFile}.yaml`,
            `${configFile}.yml`,
        ].forEach((configName) => {
            if (config) {
                return;
            }

            try {
                config = getNearestConfigPath(
                    configName,
                    // eslint-disable-next-line no-template-curly-in-string
                    filePaths[0] as "/${string}",
                ) as string;
            } catch {
                // Ignore
            }
        });

        if (config) {
            eslintCommands.push(
                `${packageManager} exec eslint ${eslintArguments.join(" ")} --config ${config} ${filePaths.join(" ")}`,
            );
        }
    });

    return eslintCommands;
};

export default createEslintCommands;
