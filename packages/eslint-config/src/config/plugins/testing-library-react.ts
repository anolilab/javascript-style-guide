import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";
import anolilabEslintConfig from "../../utils/eslint-config";
import { consolePlugin } from "../../utils/loggers";

// Workaround VS Code trying to run this file twice!
if (!global.hasAnolilabEsLintTestConfigLoaded) {
    if (anolilabEslintConfig["info_on_testing_library_framework"] !== false) {
        consolePlugin(`testing-library: loading "react" ruleset`);
    }

    global.hasAnolilabEsLintTestConfigLoaded = true;
}

// For performance enable react-testing-library only on test files
const config: Linter.Config = createConfig(
    "tests",
    {
        extends: [`plugin:testing-library/react`],
    },
    {
        browser: true,
        es6: true,
        node: true,
    },
);

export default config;
