/** @ts-check */
/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ["@anolilab/eslint-config"],
    ignorePatterns: ["!**/*"],
    env: {
        // Your environments (which contains several predefined global variables)
        // Most environments are loaded automatically if our rules are added
    },
    parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
    },
    globals: {
        // Your global variables (setting to false means it's not allowed to be reassigned)
        // myGlobal: false
    },
    rules: {
        // Customize your rules
    },
    overrides: [
        {
            files: [
                "*.ts",
                "*.tsx",
                "*.js",
                "*.jsx",
            ],
            // Set parserOptions.project for the project to allow TypeScript to create the type-checker behind the scenes when we run linting
            parserOptions: {
            },
            rules: {},
        },
        {
            files: ["*.ts", "*.tsx"],
            // Set parserOptions.project for the project to allow TypeScript to create the type-checker behind the scenes when we run linting
            parserOptions: {
            },
            rules: {},
        },
        {
            files: ["*.js", "*.jsx"],
            rules: {},
        },
    ],
};
