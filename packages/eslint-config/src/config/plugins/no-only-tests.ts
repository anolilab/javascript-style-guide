import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";
import isInEditor from "../../utils/is-in-editor";

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
const config: Linter.Config = createConfig("tests", {
    plugins: ["no-only-tests"],
    rules: {
        "no-only-tests/no-only-tests": isInEditor ? "off" : "error",
    },
});

export default config;
