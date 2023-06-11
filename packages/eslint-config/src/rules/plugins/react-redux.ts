// @see https://github.com/DianaSuvorova/eslint-plugin-react-redux#readme
const config = {
    extends: ["plugin:react-redux/recommended"],
    plugins: ["react-redux"],
    rules: {
        "react-redux/prefer-separate-component-file": "off",
        "react-redux/mapStateToProps-prefer-selectors": "off",
    },
};

export default config;
