import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import concatFiles from "../../utils/concat-files";
import getPackageManager from "../../utils/get-package-manager";
import createEslintCommands from "./create-eslint-commands";

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

const group: Config = {
    [`**/*.{${["json", "json5", "jsonc"].join(",")}}`]: async (filenames: string[]) => [...(await createEslintCommands(filenames))],
    [`**/*.{${[extensions].join(",")}}`]: async (filenames: string[]) => [
        `${getPackageManager()} execprettier --write ${concatFiles(filenames)}`,
        ...(await createEslintCommands(filenames)),
    ],
};

export default group;
