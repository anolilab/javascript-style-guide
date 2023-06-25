import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

// @see https://tanstack.com/query/v4/docs/react/eslint/eslint-plugin-query
const config: Linter.Config = createConfig("all", {
    extends: ["plugin:@tanstack/eslint-plugin-query/recommended"],
});

export default config;
