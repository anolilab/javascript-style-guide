import type { Config } from "lint-staged";

import getPackageManager from "../utils/get-package-manager";

const group: Config = {
    "*": [`${getPackageManager()} exec secretlint`],
};

export default group;
