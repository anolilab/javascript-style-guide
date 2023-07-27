import getNearestConfigPath from "../../utils/get-nearest-config-path";
import anolilabLintStagedConfig from "../../utils/lint-staged-config";
import groupFilePathsByDirectoryName from "./group-file-paths-by-directory-name";
import removeIgnoredFiles from "./remove-ignored-files";

interface EslintConfig {
    cache?: boolean;
    config?: string;
    "fix-type"?: string[];
    "max-warnings"?: number | string | false;
    rules?: string[];
}

interface ESLintSettings {
    settings?: {
        eslint?: EslintConfig;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const eslintSettings: EslintConfig = (anolilabLintStagedConfig as ESLintSettings)?.settings?.eslint ?? ({} as EslintConfig);

const eslintGlobalRulesForFix = [
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
    "react-hooks/exhaustive-deps: off",
];

const configFile = ".eslintrc";

const createEslintArguments = (): string[] => {
    const eslintArguments: string[] = [];

    if (eslintSettings["max-warnings"] !== undefined && Number.isNaN(eslintSettings["max-warnings"])) {
        eslintArguments.push(`--max-warnings=${eslintSettings["max-warnings"]}`);
    } else if (eslintSettings["max-warnings"] !== false) {
        eslintArguments.push("--max-warnings=0");
    }

    const rules = [];

    if (eslintSettings.rules !== undefined && Array.isArray(eslintSettings.rules)) {
        rules.push([...eslintSettings.rules, ...eslintGlobalRulesForFix].filter((rule) => rule.trim().length > 0).map((r) => `"${r.trim()}"`));
    } else {
        rules.push(eslintGlobalRulesForFix.map((r) => `"${r.trim()}"`));
    }

    if (rules.length > 0) {
        eslintArguments.push(`--rule ${rules.join(" --rule ")}`);
    }

    // For lint-staged it's safer to not apply the fix command if it changes the AST
    // @see https://eslint.org/docs/user-guide/command-line-interface#--fix-type
    const fixType = [...(eslintSettings["fix-type"] ?? ["layout"])].filter((type) => type.trim().length > 0);

    if (fixType.length > 0) {
        eslintArguments.push(`--fix-type ${fixType.join(",")}`, "--fix");
    }

    if (eslintSettings.cache) {
        eslintArguments.push("--cache");
    }

    return eslintArguments;
};

const createEslintCommands = async (filenames: string[]): Promise<string[]> => {
    const filteredFiles = await removeIgnoredFiles(filenames);

    const eslintArguments = createEslintArguments();

    if (eslintSettings.config) {
        eslintArguments.push(`--config ${eslintSettings.config}`);

        return [`cross-env NO_LOGS=true eslint ${eslintArguments.join(" ")} ${filteredFiles.join(" ")}`];
    }

    const groupedFilesNames = groupFilePathsByDirectoryName(filteredFiles);
    const eslintCommands: string[] = [];

    Object.values(groupedFilesNames).forEach((filePaths) => {
        let config: string | undefined;

        [configFile, `${configFile}.js`, `${configFile}.cjs`, `${configFile}.json`, `${configFile}.yaml`, `${configFile}.yml`].forEach((configName) => {
            if (config) {
                return;
            }

            try {
                // eslint-disable-next-line no-template-curly-in-string
                config = getNearestConfigPath(configName, filePaths[0] as "/${string}") as string;
            } catch {
                // Ignore
            }
        });

        if (config) {
            eslintCommands.push(`cross-env NO_LOGS=true eslint ${eslintArguments.join(" ")} --config ${config} ${filePaths.join(" ")}`);
        }
    });

    return eslintCommands;
};

export default createEslintCommands;
