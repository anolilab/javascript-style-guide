import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";
import { ESLint } from "eslint";

import anolilabLintStagedConfig from "../utils/lint-staged-config";
import concatFiles from "../utils/concat-files";
import getNearestConfigPath from "../utils/get-nearest-config-path";
import {dirname} from "node:path";
import isWindows from "../utils/is-windows";
import {quote} from "shell-quote";
import * as console from "console";

const extensions = ["cjs", "js", "mjs", "cts", "ts", "mts", "yml", "yaml", "jsx", "tsx", "mdx", "toml"];

if (!global.hasAnolilabLintStagedMarkdownCli) {
    global.hasAnolilabLintStagedMarkdownCli = hasDependency("markdownlint-cli") || hasDevDependency("markdownlint-cli");
}

if (!global.hasAnolilabLintStagedMarkdownCli2) {
    global.hasAnolilabLintStagedMarkdownCli2 = hasDependency("markdownlint-cli2") || hasDevDependency("markdownlint-cli2");
}

if (!global.hasAnolilabLintStagedMarkdownCli && !global.hasAnolilabLintStagedMarkdownCli2) {
    extensions.push("md");
}

const eslintSettings = (anolilabLintStagedConfig as unknown as { [settings: string]: { [eslint: string]: any } })?.["settings"]?.["eslint"] ?? {};

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

const removeIgnoredFiles = async (filenames: string[]): Promise<string[]> => {
    const eslint = new ESLint();
    const ignoredFiles = await Promise.all(filenames.map((filename) => eslint.isPathIgnored(filename)));
    const filteredFiles = filenames.filter((_, i) => !ignoredFiles[i]);

    return filteredFiles.map((filename) => `"${isWindows ? filename : quote([filename])}"`);
};

const groupFilePathsByDirectoryName = (filePaths: string[]) => {
    return filePaths.reduce((groups: {[key: string]: string[]}, filePath: string) => {
        const dirName = dirname(filePath);

        if (!groups[dirName]) {
            groups[dirName] = [];
        }

        (groups[dirName] as string[]).push(filePath);

        return groups;
    }, {});
}

const configFile = ".eslintrc";

const createEslintCommands = async (filenames: string[]): Promise<string[]> => {
    const filteredFiles = await removeIgnoredFiles(filenames);

    const args: string[] = [];

    if (!Number.isNaN(eslintSettings["max-warnings"])) {
        if (!eslintSettings["max-warnings"]) {
            args.push("--max-warnings=0");
        }
    } else {
        args.push(`--max-warnings=${eslintSettings["max-warnings"]}`);
    }

    const rules = [];

    if (Array.isArray(eslintSettings["rules"])) {
        rules.push([...eslintSettings["rules"], ...eslintGlobalRulesForFix].filter((rule) => rule.trim().length > 0).map((r) => `"${r.trim()}"`));
    } else {
        rules.push(eslintGlobalRulesForFix.map((r) => `"${r.trim()}"`));
    }

    if (rules.length > 0) {
        args.push(`--rule ${rules.join(" --rule ")}`);
    }

    // For lint-staged it's safer to not apply the fix command if it changes the AST
    // @see https://eslint.org/docs/user-guide/command-line-interface#--fix-type
    const fixType = [...(eslintSettings["fix-type"] ?? ["layout"])].filter((type) => type.trim().length > 0);

    if (fixType.length > 0) {
        args.push(`--fix-type ${fixType.join(",")}`);
    }

    if (eslintSettings["fix"]) {
        args.push("--fix");
    }

    if (eslintSettings["cache"]) {
        args.push("--cache");
    }

    if (eslintSettings["config"]) {
        args.push(`--config ${eslintSettings["config"]}`);

        return [`cross-env NO_LOGS=true eslint ${args.join(" ")} ${filteredFiles}`];
    }

    const groupedFilesNames = groupFilePathsByDirectoryName(filteredFiles);

    const eslintCommands: string[] = [];

    Object.values(groupedFilesNames).forEach((filePaths) => {
        let config: string | undefined = undefined;

        [configFile, `${configFile}.js`, `${configFile}.cjs`, `${configFile}.json`, `${configFile}.yaml`, `${configFile}.yml`].forEach((configName) => {
            if (config) {
                return;
            }

            try {
                // eslint-disable-next-line no-template-curly-in-string
                config = getNearestConfigPath(configName, filePaths[0] as "/${string}");
            } catch {
                // Ignore
            }
        });
console.log("config", config, filePaths);
        if (config) {
            eslintCommands.push(`cross-env NO_LOGS=true eslint ${args.join(" ")} --config ${config} ${filePaths.join(" ")}`);
        }
    });

    return eslintCommands;
};

const group: Config = {
    [`*.{${[extensions].join(",")}}`]: async (filenames: string[]) => [
        `prettier --write ${concatFiles(filenames)}`,
        ...(await createEslintCommands(filenames)),
    ],
    [`*.{${["json", "json5", "jsonc"].join(",")}}`]: async (filenames: string[]) => [...(await createEslintCommands(filenames))],
};

export default group;
