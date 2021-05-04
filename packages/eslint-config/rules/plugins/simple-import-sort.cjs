module.exports = {
    rules: {
        "simple-import-sort/imports": ["error", { groups: [["^\\u0000"], ["^[^.]"], ["^\\."]] }],
        "simple-import-sort/exports": "off",
    },
};
