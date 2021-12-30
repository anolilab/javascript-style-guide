const isModuleAvailable = require("../../lib/is-module-available.cjs");
const { consoleLog } = require("../../lib/loggers.cjs");

let ruleset;

switch (true) {
    case isModuleAvailable("react"):
        ruleset = "react";
        break;

    default:
        ruleset = "dom";
}

consoleLog(`  eslint-plugin-testing-library/${ruleset}`);

module.exports = {
    extends: [`plugin:testing-library/${ruleset}`],
    rules: {
        // Not included in jest/recommended
        "testing-library/await-fire-event": 0,
        "testing-library/consistent-data-testid": 0,
        "testing-library/no-debug": 0,
        "testing-library/no-dom-import": 0,
        "testing-library/no-manual-cleanup": 0,
        "testing-library/no-render-in-setup": 0,
        "testing-library/no-await-sync-events": 0,
        "testing-library/no-wait-for-empty-callback": 0,
        "testing-library/no-wait-for-snapshot": 0,
        "testing-library/prefer-explicit-assert": 0,
        "testing-library/prefer-presence-queries": 0,
        "testing-library/prefer-screen-queries": 0,
        "testing-library/prefer-wait-for": 0,
    },
};
