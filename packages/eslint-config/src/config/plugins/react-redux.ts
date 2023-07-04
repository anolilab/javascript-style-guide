import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

// @see https://github.com/DianaSuvorova/eslint-plugin-react-redux#readme
const config: Linter.Config = createConfig("jsx_and_tsx", {
    extends: ["plugin:react-redux/recommended"],
    plugins: ["react-redux"],
    rules: {
        "react-redux/mapStateToProps-prefer-selectors": "off",
        "react-redux/prefer-separate-component-file": "off",
    },
});

export default config;
