import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    plugins: ["es-x"],
    settings: {
        es: { aggressive: true },
    },
});

export default config;
