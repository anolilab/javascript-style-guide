import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import concatFiles from "../utils/concat-files";

if (!global.hasAnolilabLintStagedMarkdownCli) {
    global.hasAnolilabLintStagedMarkdownCli = hasDependency("markdownlint-cli") || hasDevDependency("markdownlint-cli");
}
if (!global.hasAnolilabLintStagedMarkdownCli2) {
    global.hasAnolilabLintStagedMarkdownCli2 = hasDependency("markdownlint-cli2") || hasDevDependency("markdownlint-cli2");
}

const group: Config = {
    "**/*.md": (filenames: string[]) => [
        `prettier --write ${concatFiles(filenames)}`,
        ...(global.hasAnolilabLintStagedMarkdownCli
            ? [`markdownlint --fix --ignore '**/node_modules/**' --ignore '**/CHANGELOG.md' ${concatFiles(filenames)}`]
            : []),
        ...(global.hasAnolilabLintStagedMarkdownCli2 ? [`markdownlint-cli2 --fix '!**/node_modules/**' '!**/CHANGELOG.md' ${concatFiles(filenames)}`] : []),
    ],
    "**/*.mdx": (filenames) => [`prettier --write ${concatFiles(filenames)}`],
};

export default group;
