import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import concatFiles from "../utils/concat-files";
import getPackageManager from "../utils/get-package-manager";
import consoleLog from "../utils/logger";

if (!global.hasAnolilabLintStagedPrettier) {
    global.hasAnolilabLintStagedPrettier = hasDependency("prettier") || hasDevDependency("prettier");

    consoleLog("Prettier was found inside your package.json. It will be used to format your files, before stylelint is executed.");
}

const group: Config = {
    [`**/*.{${["css", "sass", "scss", "less"].join(",")}}`]: (filenames: string[]) => [
        ...(global.hasAnolilabLintStagedPrettier ? [`${getPackageManager()} exec prettier --ignore-unknown --write ${concatFiles(filenames)}`] : []),
        `${getPackageManager()} exec stylelint --fix`,
    ],
};

export default group;
