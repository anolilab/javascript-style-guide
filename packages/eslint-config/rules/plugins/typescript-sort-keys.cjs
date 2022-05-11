module.exports = {
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            plugins: ["typescript-sort-keys"],
            rules: {
                "typescript-sort-keys/interface": "error",
                "typescript-sort-keys/string-enum": "error",
            },
        },
        {
            files: ["*.js", "*.cjs", "*.mjs"],
            rules: {
                "typescript-sort-keys/interface": "off",
                "typescript-sort-keys/string-enum": "off",
            },
        },
    ],
};
