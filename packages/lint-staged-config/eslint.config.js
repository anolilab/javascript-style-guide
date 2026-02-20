import { createConfig, getFilesGlobs } from "@anolilab/eslint-config";

export default createConfig(
    {
        ignores: ["**/__fixtures__", "packem.config.ts", ".prettierrc.js"],
    },
    {
        files: ["./README.md"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
            "import/no-commonjs": "off",
            "jsdoc/check-tag-names": "off",
        },
    },
    {
        files: getFilesGlobs("markdown_inline_js_jsx"),
        rules: {
            "import/no-commonjs": "off",
            "import/no-unresolved": "off",
            "jsonc/no-comments": "off",
            "no-import-assign": "off",
            "no-redeclare": "off",
        },
    },
);
