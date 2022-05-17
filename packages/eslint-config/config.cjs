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
    "markdown",
    "optimize-regex",
    "promise",
    "simple-import-sort",
    "unicorn",
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
    "mdx",
    "react-redux",
    "no-unsanitized",
    "lodash",
    ["lodash", "lodash-fp"],
    "jsdoc",
    "react",
    ["react", "jsx-a11y"],
    ["react", "react-hooks"],
];

const testRules = [
    "cypress",
    "jest",
    ["jest", "jest-async", "jest-dom"],
    "jest-dom",
    ["jest-formatting", "jest"],
    ["@testing-library/jest-dom", "jest-dom"],
    ["@testing-library/dom", "testing-library"],
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
