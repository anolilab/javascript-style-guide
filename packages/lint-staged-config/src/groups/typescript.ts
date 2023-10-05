import { env } from "node:process";

import type { Config } from "lint-staged";

import getNearestConfigPath from "../utils/get-nearest-config-path";
import getPackageManager from "../utils/get-package-manager";

const group: Config = {
    [`**/*.{${["ts", "mts", "cts"].join(",")}}`]: (filenames: string[]) => {
        const commands = new Set<string>();

        filenames.forEach((filePath) => {
            try {
                // eslint-disable-next-line no-template-curly-in-string
                const tsconfigPath = getNearestConfigPath("tsconfig.json", filePath as "/${string}") as string;

                commands.add(`${getPackageManager()} exec tsc --noEmit --project ${tsconfigPath}`);
            } catch (error) {
                if (env["DEBUG"]) {
                    console.error(error);
                }
            }
        });

        return [...commands];
    },
};

export default group;
