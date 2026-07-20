import { createConfig } from "@anolilab/eslint-config";

export default createConfig(
    {
        ignores: [".prettierrc.js", "**/*.d.cts", "**/*.d.mts", "__tests__/**", "README.md"],
    },
    {
        rules: {
            // sonarjs v4 now fires on any primary export (not just classes); disable until
            // a new version of @anolilab/eslint-config is released with this turned off
            "sonarjs/file-name-differ-from-class": "off",
        },
    },
    {
        // The install bin is built to both ESM and CJS; CJS cannot use top-level await, so the
        // async work stays in an IIFE.
        files: ["src/bin.ts"],
        rules: {
            "unicorn/prefer-top-level-await": "off",
        },
    },
);
