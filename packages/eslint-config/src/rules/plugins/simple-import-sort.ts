const config = {
    plugins: ["simple-import-sort"],
    rules: {
        "simple-import-sort/imports": ["error", { groups: [["^\\u0000"], ["^[^.]"], ["^\\."]] }],
        "simple-import-sort/exports": "off",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
    },
};

export default config;
