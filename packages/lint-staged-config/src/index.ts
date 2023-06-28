import { env } from "node:process";

import { loadedPluginsNames, possiblePlugins } from "./config";
import consoleLog from "./utils/logger";

// Workaround VS Code trying to run this file twice!
if (!global.hasAnolilabStagedLintConfigLoaded) {
    if (env["DEBUG"]) {
        consoleLog("\n@anolilab/lint-stage-config loaded the following plugins:\n");

        loadedPluginsNames.forEach((pluginName) => {
            consoleLog(`    ${pluginName}`);
        });
    }

    let hasLogged = false;

    Object.entries(possiblePlugins).forEach(([plugin, dependencies]) => {
        const hasOneDependency = Object.values(dependencies).some(Boolean);

        if (hasOneDependency) {
            hasLogged = true;
            consoleLog(
                `\nYour package.json container dependencies for the "${plugin}" plugin, please add the following dependencies with your chosen package manager to enable this plugin:`,
            );

            Object.entries(dependencies).forEach(([dependency, installed]) => {
                if (!installed) {
                    consoleLog(`    ${dependency}`);
                }
            });
        }
    });

    if (hasLogged) {
        consoleLog("\nTo disable this message, add the following to your package.json:");
        consoleLog('    "anolilab": { "lint-stage-config": { plugin: { "plugin-name": false } } }\n');
    }

    consoleLog('To disable all logging, add the following to your eslint command call "NO_LOGS=true eslint ..."');

    global.hasAnolilabStagedLintConfigLoaded = true;
}

export { loadedPlugins as default } from "./config";
