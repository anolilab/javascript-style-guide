const config = require("./packages/eslint-config");

module.exports = {
    ...config,
    env: {
        // Your environments (which contains several predefined global variables)
        browser: true,
        commonjs: true,
        es6: true,
        node: false,
        // mocha: true,
        // jquery: true
    },
    globals: {
        // Your global variables (setting to false means it's not allowed to be reassigned)
        //
        // myGlobal: false
    },
    overrides: [
        {
            files: ["*.ts", "*.mts", "*.cts", "*.tsx"],
            parserOptions: {
                project: "./tsconfig.json",

                tsconfigRootDir: __dirname,
            },
        },
    ],
    plugins: [],
    root: true,
    rules: {
        // Customize your rules
        "no-console": "off",
        "no-secrets/no-secrets": "off",
        "unicorn/text-encoding-identifier-case": "off",
    },
};
