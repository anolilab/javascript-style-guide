import type { Linter } from "eslint";

const config: Linter.Config = {
    plugins: ["es"],

    overrides: [
        {
            files: ["*.js", "*.jsx"],
            settings: {
                es: { aggressive: true },
            },
        },
    ],
};

export default config;
