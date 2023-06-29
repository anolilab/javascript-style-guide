import type { Config } from "lint-staged";

import concatFiles from "../utils/concat-files";

const group: Config = {
    [`*.{${["css", "sass", "scss", "less"].join(",")}}`]: (filenames: string[]) => [
        `prettier --ignore-unknown --write ${concatFiles(filenames)}`,
        "stylelint --fix",
    ],
};

export default group;
