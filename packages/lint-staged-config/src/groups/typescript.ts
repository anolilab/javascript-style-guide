import { env } from "node:process";

import type { Config } from "lint-staged";

import getNearestConfigPath from "../utils/get-nearest-config-path";
import getPackageManager from "../utils/get-package-manager";
import anolilabLintStagedConfig from "../utils/lint-staged-config";

interface TypescriptConfig {
    exclude?: string[];
}

interface StagedConfig {
    typescript?: TypescriptConfig;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const typescriptSettings: TypescriptConfig = (anolilabLintStagedConfig as StagedConfig)?.typescript ?? ({} as TypescriptConfig);

const group: Config = {
    [`**/*.{${["ts", "mts", "cts"].join(",")}}`]: (filenames: string[]) => {
        const commands = new Set<string>();

        filenames.forEach((filePath) => {
            if (typescriptSettings.exclude?.includes(filePath)) {
                if (env["DEBUG"]) {
                    console.info(`Skipping ${filePath} as it's excluded in the settings.`);
                }

                return;
            }

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
