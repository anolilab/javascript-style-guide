import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

// @see https://www.npmjs.com/package/@arthurgeron/eslint-plugin-react-usememo
const config: Linter.Config = createConfig("jsx_and_tsx", {
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["@arthurgeron/react-usememo"],
    rules: {
        "@arthurgeron/react-usememo/require-usememo": "error",
    },
});

export default config;
