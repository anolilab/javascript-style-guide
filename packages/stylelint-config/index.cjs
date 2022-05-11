const rules = [
    "./rules/a11y.cjs",
    "./rules/declaration-block-no-ignored-properties.cjs",
    "./rules/no-unsupported-browser-features.cjs",
    "./rules/rational-order.cjs",
    "./rules/require-units.cjs",
    "./rules/selector-no-empty.cjs",
    "./rules/standard.cjs",
];

module.exports = {
    extends: rules.map((element) => require.resolve(element)),
    rules: {
        indentation: 4,
    },
};
