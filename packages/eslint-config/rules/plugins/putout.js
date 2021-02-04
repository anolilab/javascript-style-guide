// @see https://github.com/coderaiser/putout
module.exports = {
    plugins: ["putout"],
    rules: {
        "putout/putout": [
            "error",
            {
                plugins: ["apply-shorthand-properties"],

                rules: {
                    "apply-shorthand-properties": "on",

                    "apply-nullish-coalescing": "off",
                    "remove-duplicate-interface-keys": "off",
                    "convert-throw": "off",
                    putout: "off",
                    "regexp/convert-replace-to-replace-all": "off",

                    "convert-array-copy-to-slice": "off",
                    "convert-for-each-to-for-of": "off",
                    "remove-unused-variables": "off",
                    "remove-process-exit": "off",
                    "remove-debugger": "off",
                    "remove-console": "off",
                    "remove-only": "off",
                    "remove-skip": "off",
                    "apply-numeric-separators": "off",
                    "declare-undefined-variables": "off",
                },
            },
        ],
    },
};
