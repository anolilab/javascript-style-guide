const checkMissing = require("./lib/missing");
const showLoaded = require("./lib/loaded");
const { rules, pluginRules, extraInstallPackage } = require("./configs");

// Workaround VS Code trying to run this file twice!
if (!global.hasAnolilabEsLintConfigLoaded) {
    checkMissing(pluginRules, extraInstallPackage);
    showLoaded(pluginRules, []);

    // Disable some rules in unit tests
    rules.push("test-overrides");

    global.hasAnolilabEsLintConfigLoaded = true;
}

module.exports = {
    extends: rules
        .map((plugin) => require.resolve(`./rules/${plugin.split("@")[0]}`))
        .concat(
            pluginRules.map((plugin) => require.resolve(`./rules/plugins/${plugin.split("@")[0]}`)),
        ),
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    },
    env: {
        es2021: true,
    },
    ignorePatterns: [
        "!.*",

        ".git/",
        "node_modules/",
        "bower_components/",
        "jspm_packages/",
        ".npm/",
        "vendor/",

        "lib-cov/",
        "coverage/",
        ".nyc_output/",
        ".cache/",

        "build/",
        "dist/",
        "tmp/",

        "**/*.min.*",
    ],
};
