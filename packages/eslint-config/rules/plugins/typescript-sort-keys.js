const typescriptSortKeys = {
    rules: {
        "typescript-sort-keys/interface": "error",
        "typescript-sort-keys/string-enum": "error",
    },
    overrides: [
        {
            files: "*.js",
            rules: {
                "typescript-sort-keys/interface": "off",
                "typescript-sort-keys/string-enum": "off",
            },
        },
    ],
};

export default typescriptSortKeys
