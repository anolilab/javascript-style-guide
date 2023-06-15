import type { Linter } from "eslint";

const config: Linter.Config = {
    plugins: ["jest-async"],
    rules: {
        "jest-async/expect-return": "error",
    },
};

export default config;
