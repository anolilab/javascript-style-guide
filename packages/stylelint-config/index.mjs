import { fileURLToPath } from "node:url";
import path from "node:path";

const cconfig = [
    "./dist/config/best-practices.mjs",
    "./dist/config/declaration-block-no-ignored-properties.mjs",
    "./dist/config/high-performance-animation.mjs",
    "./dist/config/no-unsupported-browser-features.mjs",
    "./dist/config/require-units.mjs",
    "./dist/config/selector-no-empty.mjs",
    "./dist/config/standard.mjs",
    "./dist/config/tailwindcss.mjs",
];

/**
 * @param {string} specifier
 * @returns {string}
 */
const resolvePath = (specifier) => {
    const currentModuleDir = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(currentModuleDir, specifier);
};

const config = {
    extends: [...cconfig.map(resolvePath), "stylelint-config-clean-order"],
};

export default config;
