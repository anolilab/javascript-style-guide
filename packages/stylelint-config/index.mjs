import { createRequire } from "node:module";

const cconfig = [
    "./dist/config/a11y.mjs",
    "./dist/config/best-practices.mjs",
    "./dist/config/declaration-block-no-ignored-properties.mjs",
    "./dist/config/high-performance-animation.mjs",
    "./dist/config/no-unsupported-browser-features.mjs",
    "./dist/config/require-units.mjs",
    "./dist/config/selector-no-empty.mjs",
    "./dist/config/standard.mjs",
    "./dist/config/tailwindcss.mjs",
];

const resolvePath = async (path) => {
    return await import.meta.resolve(path, import.meta.url);
};

const config = {
    extends: [...cconfig.map((element) => resolvePath(element)), "stylelint-config-clean-order"],
};

export default config;
