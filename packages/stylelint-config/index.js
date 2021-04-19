const rules = [
    "./rules/a11y",
    "./rules/declaration-block-no-ignored-properties",
    "./rules/no-unsupported-browser-features",
    "./rules/rational-order",
    "./rules/require-units",
    "./rules/selector-no-empty",
    "./rules/standard",
];

export default {
    extends: rules.map(require.resolve),
    rules: {
        "indentation": 4,
    }
};
