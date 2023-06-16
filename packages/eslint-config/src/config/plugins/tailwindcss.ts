import type { Linter } from "eslint";

const config: Linter.Config = {
    plugins: ["tailwindcss"],
    extends: ["plugin:tailwindcss/recommended"],
};

export default config;
