import { env } from "node:process";

import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";
import anolilabEslintConfig from "../../utils/eslint-config";
import { consoleLog } from "../../utils/loggers";

if (!global.hasAnolilabEsLintConfigDeprecation && (hasDependency("eslint-plugin-deprecation") || hasDevDependency("eslint-plugin-deprecation"))) {
    global.hasAnolilabEsLintConfigDeprecation = true;
    let showLog: boolean = env["DISABLE_INFO_ON_DISABLING_ETC_NO_DEPRECATED"] !== "true";

    if (showLog && anolilabEslintConfig["info_on_disabling_etc_no_deprecated"] !== undefined) {
        showLog = anolilabEslintConfig["info_on_disabling_etc_no_deprecated"] as boolean;
    }

    if (showLog) {
        consoleLog(`\n@anolilab/eslint-config found "eslint-plugin-deprecation" package. \n
    Following rules are disabled: etc/no-deprecated. \n`);
    }
}

const config: Linter.Config = createConfig("typescript", {
    extends: ["plugin:etc/recommended"],
    plugins: ["etc"],
    rules: {
        "etc/no-deprecated": global.hasAnolilabEsLintConfigDeprecation ? "off" : "error",
    },
});

export default config;
