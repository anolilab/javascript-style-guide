import { createConfig, getFilesGlobs } from "@anolilab/eslint-config";

export default createConfig({
    ignores: ["**/__fixtures__"],
}, {
    files: ["./README.md"],
    rules: {
        "import/no-commonjs": "off",
        "jsdoc/check-tag-names": "off",
        "unicorn/prefer-module": "off",
    },
}, {
    files: getFilesGlobs("markdown_inline_js_jsx"),
    rules: {
        "import/no-commonjs": "off",
        "import/no-unresolved": "off",
        "jsonc/no-comments": "off",
        "no-import-assign": "off",
        "no-redeclare": "off",
    },
});
