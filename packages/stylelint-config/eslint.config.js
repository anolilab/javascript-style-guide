import { createConfig } from "@anolilab/eslint-config";

export default createConfig(
    {
        ignores: [".prettierrc.js", "**/*.d.cts", "**/*.d.mts", "__tests__/**"],
    },
    {
        rules: {
            // sonarjs v4 now fires on any primary export (not just classes); disable until
            // a new version of @anolilab/eslint-config is released with this turned off
            "sonarjs/file-name-differ-from-class": "off",
        },
    },
);
