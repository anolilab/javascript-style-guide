module.exports = {
    plugins: ["markdown"],
    overrides: [
        {
            files: ["*.md", "**/*.md"],
            processor: "markdown/markdown",
            parserOptions: {
                ecmacFeatures: {
                    impliedStrict: true,
                },
            },
            rules: {
                "@typescript-eslint/no-redeclare": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-use-before-define": "off",
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/comma-dangle": "off",
                "no-alert": "off",
                "no-restricted-imports": "off",
                "no-unused-expressions": "off",
                "global-require": "off",
                "import/no-unresolved": "off",
                "import/order": "off",
                "no-undef": "off",
                "no-console": "off",
                "no-unused-vars": "off",
                "prefer-reflect": "off",
                strict: "off",
            },
        },
    ],
};
