// eslint-disable-next-line no-var
const config = [
    "./dist/config/a11y.js",
    "./dist/config/best-practices.js",
    "./dist/config/declaration-block-no-ignored-properties.js",
    "./dist/config/high-performance-animation.js",
    "./dist/config/no-unsupported-browser-features.js",
    "./dist/config/require-units.js",
    "./dist/config/selector-no-empty.js",
    "./dist/config/standard.js",
    "./dist/config/tailwindcss.js",
];

module.exports = {
    extends: [...config.map((element) => require.resolve(element)), "stylelint-config-clean-order"],
};
