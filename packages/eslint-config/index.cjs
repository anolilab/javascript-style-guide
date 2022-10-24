const path = require("node:path");
const checkMissing = require("./lib/check-missing.cjs");
const showLoaded = require("./lib/show-loaded.cjs");
const { rules, pluginRules, extraInstallPackage } = require("./config.cjs");

// Workaround VS Code trying to run this file twice!
if (!global.hasAnolilabEsLintConfigLoaded) {
    checkMissing(pluginRules, extraInstallPackage);
    showLoaded(pluginRules, extraInstallPackage);

    global.hasAnolilabEsLintConfigLoaded = true;
}

module.exports = {
    extends: [
        ...rules
            // eslint-disable-next-line no-undef
            .map((plugin) => path.join(__dirname, `./rules/${plugin.split("@")[0]}.cjs`)),
        // eslint-disable-next-line no-undef
        ...pluginRules.map((plugin) => path.join(__dirname, `./rules/plugins/${plugin.split("@")[0]}.cjs`)),
    ],
    // @see https://www.npmjs.com/package/@rushstack/eslint-plugin-security
    plugins: ["@rushstack/eslint-plugin-security"],
    rules: {
        // This is disabled for tools because, for example, it is a common and safe practice for a tool
        // to read a RegExp from a config file and use it to filter files paths.
        // eslint-disable-next-line no-undef
        "@rushstack/security/no-unsafe-regexp": process.env.TRUSTED_TOOL ? "off" : "warn",
    },
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
