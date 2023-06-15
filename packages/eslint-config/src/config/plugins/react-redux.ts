import type { Linter } from "eslint";

// @see https://github.com/DianaSuvorova/eslint-plugin-react-redux#readme
const config: Linter.Config = {
    extends: ["plugin:react-redux/recommended"],
    plugins: ["react-redux"],
    rules: {
        "react-redux/prefer-separate-component-file": "off",
        "react-redux/mapStateToProps-prefer-selectors": "off",
    },
};

export default config;
