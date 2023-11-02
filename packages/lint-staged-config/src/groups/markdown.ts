import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import concatFiles from "../utils/concat-files";
import getPackageManager from "../utils/get-package-manager";
import consoleLog from "../utils/logger";

if (!global.hasAnolilabLintStagedMarkdownCli) {
    global.hasAnolilabLintStagedMarkdownCli = hasDependency("markdownlint-cli") || hasDevDependency("markdownlint-cli");
}

if (!global.hasAnolilabLintStagedMarkdownCli2) {
    global.hasAnolilabLintStagedMarkdownCli2 = hasDependency("markdownlint-cli2") || hasDevDependency("markdownlint-cli2");
}

if (!global.hasAnolilabLintStagedPrettier) {
    global.hasAnolilabLintStagedPrettier = hasDependency("prettier") || hasDevDependency("prettier");

    consoleLog("Prettier was found inside your package.json. It will be used to format your markdown files.");
}

const group: Config = {
    "**/*.md": (filenames: string[]) => [
        ...(global.hasAnolilabLintStagedPrettier ? [`${getPackageManager()} exec prettier --write ${concatFiles(filenames)}`] : []),
        ...(global.hasAnolilabLintStagedMarkdownCli
            ? [`${getPackageManager()} exec markdownlint --fix --ignore '**/node_modules/**' --ignore '**/CHANGELOG.md' ${concatFiles(filenames)}`]
            : []),
        ...(global.hasAnolilabLintStagedMarkdownCli2
            ? [`${getPackageManager()} exec markdownlint-cli2 --fix '!**/node_modules/**' '!**/CHANGELOG.md' ${concatFiles(filenames)}`]
            : []),
    ],
    "**/*.mdx": (filenames) => [...(global.hasAnolilabLintStagedPrettier ? [`${getPackageManager()} exec prettier --write ${concatFiles(filenames)}`] : [])],
};

export default group;
