const config = require("./packages/eslint-config/dist");
const globals = require("./packages/eslint-config/dist/globals");

module.exports = {
    ...config,
    extends: [...config.extends, "./packages/eslint-config/dist/typescript-type-checking"],
    globals: {
        ...config?.globals,
        ...globals.es2021,
    },
    overrides: [
        ...config.overrides,
        {
            files: ["*.ts", "*.mts", "*.cts", "*.tsx", ".mdx"],
            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
    ],
    root: true,
    rules: {
        ...config.rules,
        // Customize your rules
        "no-console": "off",
        "no-secrets/no-secrets": "off",
        "unicorn/text-encoding-identifier-case": "off",
    },
};
