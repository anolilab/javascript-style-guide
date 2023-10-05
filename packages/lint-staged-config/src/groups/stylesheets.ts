import type { Config } from "lint-staged";

import concatFiles from "../utils/concat-files";
import getPackageManager from "../utils/get-package-manager";

const group: Config = {
    [`**/*.{${["css", "sass", "scss", "less"].join(",")}}`]: (filenames: string[]) => [
        `${getPackageManager()} exec prettier --ignore-unknown --write ${concatFiles(filenames)}`,
        `${getPackageManager()} exec stylelint --fix`,
    ],
};

export default group;
