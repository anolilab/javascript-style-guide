import { hasAnyDep, pkg } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";
import { consolePlugin } from "../../utils/loggers";

let anolilabEslintConfig: { [key: string]: boolean | undefined } = {};

if (pkg) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    anolilabEslintConfig = pkg?.["anolilab"]?.["eslint-config"];
}

let ruleset = "dom";

if (hasAnyDep(["react", "@testing-library/react"])) {
    ruleset = "react";
}

// Workaround VS Code trying to run this file twice!
if (!global.hasAnolilabEsLintTestConfigLoaded) {
    if (anolilabEslintConfig?.["info_on_testing_library_framework"] !== false) {
        consolePlugin(`testing-library: loading "${ruleset}" ruleset`);
    }

    global.hasAnolilabEsLintTestConfigLoaded = true;
}

// For performance enable react-testing-library only on test files
const config: Linter.Config = createConfig(
    "tests",
    {
        extends: [`plugin:testing-library/${ruleset}`],
    },
    {
        browser: true,
        es6: true,
        node: true,
    },
);

export default config;
