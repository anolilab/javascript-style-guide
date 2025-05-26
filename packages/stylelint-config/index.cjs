// eslint-disable-next-line no-var
const config = [
    "./dist/config/best-practices.cjs",
    "./dist/config/declaration-block-no-ignored-properties.cjs",
    "./dist/config/high-performance-animation.cjs",
    "./dist/config/no-unsupported-browser-features.cjs",
    "./dist/config/require-units.cjs",
    "./dist/config/selector-no-empty.cjs",
    "./dist/config/standard.cjs",
    "./dist/config/tailwindcss.cjs",
];

module.exports = {
    extends: [...config.map((element) => require.resolve(element)), "stylelint-config-clean-order"],
};
