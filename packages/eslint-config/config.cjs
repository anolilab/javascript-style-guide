const { hasAnyDep, hasTypescript } = require("./lib/utils.cjs");
const isModuleAvailable = require("./lib/is-module-available.cjs");

// Base rules
const rules = ["best-practices", "errors", "style", "es6", "variables"];

// Base plugin rules
const pRules = [
    "compat",
    "eslint-comments",
    "import",
    "json",
    "jsonc",
    "jsonc",
    "markdown",
    "optimize-regex",
    "promise",
    "simple-import-sort",
    "toml",
    "unicorn",
    "yml",
    "you-dont-need-lodash-underscore",
    "you-dont-need-momentjs",

    // Security Rules
    "no-secrets",
    "radar",
];

// Optionals rules based on project dependencies
const depRules = [
    "array-func",
    "html",
    "jsdoc",
    "lodash",
    "mdx",
    "no-unsanitized",
    "react",
    "react-redux",
    ["lodash", "lodash-fp"],
    ["react", "jsx-a11y"],
    ["react", "react-hooks"],
    "tailwindcss",
];

const testRules = [
    "cypress",
    "jest",
    "jest-dom",
    ["@testing-library/dom", "testing-library"],
    ["@testing-library/jest-dom", "jest-dom"],
    ["jest", "jest-async", "jest-dom"],
    ["jest-formatting", "jest"],
];

// Extra required optional packages
const extraInstalled = [];

depRules.forEach((depRule) => {
    const rule = typeof depRule === "string" ? [depRule, depRule] : depRule;

    if (hasAnyDep(rule[0])) {
        pRules.push(rule[1]);
    }
});

testRules.forEach((depRule) => {
    const rule = typeof depRule === "string" ? [depRule, depRule] : depRule;

    if (isModuleAvailable(rule[0])) {
        pRules.push(rule[1]);
    }
});

if (hasTypescript) {
    pRules.push("typescript");
    extraInstalled.push(["typescript", "@typescript-eslint/parser"], ["typescript", "@typescript-eslint/eslint-plugin"]);

    if (hasAnyDep("eslint-plugin-typescript-sort-keys")) {
        pRules.push("typescript-sort-keys");
    }
}

module.exports = {
    rules,
    pluginRules: pRules,
    extraInstallPackage: extraInstalled,
};
