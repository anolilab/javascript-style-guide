// eslint-disable-next-line import/extensions
const config = require("./packages/eslint-config");

module.exports = {
    ...config,
    root: true,
    overrides: [
        {
            files: ["*.ts", "*.mts", "*.cts", "*.tsx"],
            parserOptions: {
                project: "./tsconfig.json",
                // eslint-disable-next-line no-undef
                tsconfigRootDir: __dirname,
            },
        },
    ],
    env: {
        // Your environments (which contains several predefined global variables)
        browser: true,
        node: false,
        commonjs: true,
        es6: true,
        // mocha: true,
        // jquery: true
    },
    globals: {
        // Your global variables (setting to false means it's not allowed to be reassigned)
        //
        // myGlobal: false
    },
    plugins: [],
    rules: {
        // Customize your rules
        "no-console": "off",
        "no-secrets/no-secrets": "off",
        "unicorn/text-encoding-identifier-case": "off",
    },
};
