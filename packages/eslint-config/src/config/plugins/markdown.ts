import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.md"],
            parserOptions: {
                ecmacFeatures: {
                    impliedStrict: true,
                },
            },
            processor: "markdown/markdown",
            rules: {
                "@typescript-eslint/comma-dangle": "off",
                "@typescript-eslint/no-redeclare": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-use-before-define": "off",
                "@typescript-eslint/no-var-requires": "off",
                "global-require": "off",
                "import/no-unresolved": "off",
                "import/order": "off",
                "no-alert": "off",
                "no-console": "off",
                "no-restricted-imports": "off",
                "no-undef": "off",
                "no-unused-expressions": "off",
                "no-unused-vars": "off",
                "prefer-reflect": "off",
                strict: "off",
            },
        },
    ],
    plugins: ["markdown"],
};

export default config;
