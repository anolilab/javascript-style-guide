import { createConfig } from "./dist/index.mjs";

export default createConfig(
    {
        ignores: ["eslint.config.js", "src/typegen.d.ts"],
    },
    {
        files: ["**/*.ts"],
        rules: {
            "no-secrets/no-secrets": "off",
        },
    },
    {
        files: ["debug-eslint.config.mjs"],
        rules: {
            "antfu/no-import-dist": "off"
        }
    }
);
