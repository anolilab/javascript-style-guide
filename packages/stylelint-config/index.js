const rules = [
    "./dist/rules/a11y.js",
    "./dist/rules/declaration-block-no-ignored-properties.js",
    "./dist/rules/no-unsupported-browser-features.js",
    "./dist/rules/rational-order.js",
    "./dist/rules/require-units.js",
    "./dist/rules/selector-no-empty.js",
    "./dist/rules/standard.js",
];

module.exports = {
    extends: rules.map((element) => require.resolve(element)),
    rules: {
        indentation: 4,
    },
};
