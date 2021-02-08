const rules = [
    "./rules/a11y",
    "./rules/declaration-block-no-ignored-properties",
    "./rules/no-unsupported-browser-features",
    "./rules/rational-order",
    "./rules/require-units",
    "./rules/selector-no-empty",
    "./rules/standard",
];

module.exports = {
    extends: rules.map(require.resolve),
};
