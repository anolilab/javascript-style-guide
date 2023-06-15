import { pkg } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

const configRules: Linter.RulesRecord = {};

let nodeVersion: string | undefined;

if (pkg?.engines?.["node"]) {
    nodeVersion = pkg.engines["node"];
}

if (nodeVersion) {
    configRules["n/no-unsupported-features/es-builtins"] = ["error", { version: nodeVersion }];
    configRules["n/no-unsupported-features/es-syntax"] = ["error", { version: nodeVersion, ignores: ["modules"] }];
    configRules["n/no-unsupported-features/node-builtins"] = ["error", { version: nodeVersion }];
}

// @see https://github.com/eslint-community/eslint-plugin-n
const config: Linter.Config = {
    extends: ["plugin:n/recommended"],
    plugins: ["n"],
    env: {
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2021,
    },
    rules: {
        // Redundant with `import/no-extraneous-dependencies`.
        "n/no-extraneous-import": "off",
        "n/no-extraneous-require": "off",

        // Redundant with `import/no-unresolved`.
        "n/no-missing-import": "off", // This rule is also buggy and doesn't support `node:`.
        "n/no-missing-require": "off",

        "n/no-unpublished-bin": "error",

        // enforce return after a callback
        "n/callback-return": "off",

        // require all requires be top-level
        // https://eslint.org/docs/rules/global-require
        "global-require": "error",

        // enforces error handling in callbacks (node environment)
        "n/handle-callback-err": "off",

        // disallow use of the Buffer() constructor
        // https://eslint.org/docs/rules/no-buffer-constructor
        "no-buffer-constructor": "error",

        // disallow mixing regular variable and require declarations
        "n/no-mixed-requires": [
            "error",
            {
                grouping: true,
                allowCall: true,
            },
        ],

        // disallow use of new operator with the require function
        "n/no-new-require": "error",

        // disallow string concatenation with __dirname and __filename
        // https://eslint.org/docs/rules/no-path-concat
        "no-path-concat": "error",

        // disallow use of process.env
        "n/no-process-env": "off",

        // disallow process.exit()
        // unicorn/no-process-exit is enabled instead.
        "n/no-process-exit": "off",

        // restrict usage of specified node modules
        "n/no-restricted-modules": "off",

        // disallow use of synchronous methods (off by default)
        "n/no-sync": "off",

        "n/process-exit-as-throw": "error",

        "n/file-extension-in-import": "off",

        ...configRules,
    },
    overrides: [
        {
            files: ["*.js", "*.mjs", "*.cjs"],
            rules: {
                // We have this enabled in addition to `import/extensions` as this one has an auto-fix.
                "n/file-extension-in-import": [
                    "error",
                    "always",
                ],
            },
        },
    ],
};

export default config;
