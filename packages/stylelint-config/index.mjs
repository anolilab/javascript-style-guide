import path from "node:path";
import { fileURLToPath } from "node:url";

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
 * @param {string} specifier - The path specifier to resolve.
 * @returns {string} The resolved absolute path.
 */
const resolvePath = (specifier) => {
    const currentModuleDirectory = path.dirname(fileURLToPath(import.meta.url));

    return path.resolve(currentModuleDirectory, specifier);
};

const config = {
    extends: [...cconfig.map((specifier) => resolvePath(specifier)), "stylelint-config-clean-order"],
};

export default config;
