import { hasAnyDep, pkg } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

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

const config: Linter.Config = {
    extends: [`plugin:testing-library/${ruleset}`],
    rules: {
        // Not included in jest/recommended
        "testing-library/await-fire-event": "off",
        "testing-library/consistent-data-testid": "off",
        "testing-library/no-debug": "off",
        "testing-library/no-dom-import": "off",
        "testing-library/no-manual-cleanup": "off",
        "testing-library/no-render-in-setup": "off",
        "testing-library/no-await-sync-events": "off",
        "testing-library/no-wait-for-empty-callback": "off",
        "testing-library/no-wait-for-snapshot": "off",
        "testing-library/prefer-explicit-assert": "off",
        "testing-library/prefer-presence-queries": "off",
        "testing-library/prefer-screen-queries": "off",
        "testing-library/prefer-wait-for": "off",
    },
};

export default config;
