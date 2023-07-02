import type { Linter } from "eslint";

const config: Linter.Config = {
    // @see https://github.com/eslint-community/eslint-plugin-security
    extends: ["plugin:security/recommended"],
    // @see https://www.npmjs.com/package/@rushstack/eslint-plugin-security
    plugins: ["@rushstack/eslint-plugin-security"],
    rules: {
        // This is disabled for tools because, for example, it is a common and safe practice for a tool
        // to read a RegExp from a config file and use it to filter files paths.

        "@rushstack/security/no-unsafe-regexp": process.env["TRUSTED_TOOL"] ? "off" : "warn",
    },
};

export default config;
