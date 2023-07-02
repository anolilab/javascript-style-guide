import type { Linter } from "eslint";

const config: Linter.Config = {
    plugins: ["simple-import-sort"],
    rules: {
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "simple-import-sort/exports": "off",
        "simple-import-sort/imports": [
            "error",
            {
                groups: [["^\\u0000"], ["^[^.]"], ["^\\."]],
            },
        ],
    },
};

export default config;
