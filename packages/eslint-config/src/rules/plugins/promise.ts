// @see https://github.com/xjamundx/eslint-plugin-promise#readme
const config = {
    extends: ["plugin:promise/recommended"],
    plugins: ["promise"],
    rules: {
        "promise/prefer-await-to-callbacks": "off",
        "promise/prefer-await-to-then": "off",
    },
};

export default config;
