const config = require("@anolilab/eslint-config");
const globals = require("@anolilab/eslint-config/globals");

module.exports = {
    ...config,
    extends: [...config.extends, "@anolilab/eslint-config/typescript-type-checking"],
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
};
