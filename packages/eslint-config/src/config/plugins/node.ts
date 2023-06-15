import type { Linter } from "eslint";

// @see https://github.com/mysticatea/eslint-plugin-node#readme
const config: Linter.Config = {
    extends: ["plugin:n/recommended"],
    env: {
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2021,
    },
    rules: {
        // enforce return after a callback
        "n/callback-return": "off",

        // require all requires be top-level
        // https://eslint.org/docs/rules/global-require
        "n/global-require": "error",

        // enforces error handling in callbacks (node environment)
        "n/handle-callback-err": "off",

        // disallow use of the Buffer() constructor
        // https://eslint.org/docs/rules/no-buffer-constructor
        "n/no-buffer-constructor": "error",

        // disallow mixing regular variable and require declarations
        "n/no-mixed-requires": ["off", false],

        // disallow use of new operator with the require function
        "n/no-new-require": "error",

        // disallow string concatenation with __dirname and __filename
        // https://eslint.org/docs/rules/no-path-concat
        "n/no-path-concat": "error",

        // disallow use of process.env
        "n/no-process-env": "off",

        // disallow process.exit()
        "n/no-process-exit": "off",

        // restrict usage of specified node modules
        "n/no-restricted-modules": "off",

        // disallow use of synchronous methods (off by default)
        "n/no-sync": "off",
    },
};

export default config;
