import { createRequire } from "node:module";

const rules = [
    "./dist/rules/a11y.mjs",
    "./dist/rules/declaration-block-no-ignored-properties.mjs",
    "./dist/rules/no-unsupported-browser-features.mjs",
    "./dist/rules/rational-order.mjs",
    "./dist/rules/require-units.mjs",
    "./dist/rules/selector-no-empty.mjs",
    "./dist/rules/standard.mjs",
];

const require = createRequire(import.meta.url);

const config = {
    extends: rules.map((element) => require.resolve(element)),
    rules: {
        indentation: 4,
    },
};

export default config;
