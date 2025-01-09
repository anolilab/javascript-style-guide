import { createConfig } from "./dist/index.mjs";

export default createConfig(
    {
        ignores: ["eslint.config.js", "typegen.d.ts"],
    },
    {
        files: ["**/*.ts"],
        rules: {
            "no-secrets/no-secrets": "off",
        },
    },
);
