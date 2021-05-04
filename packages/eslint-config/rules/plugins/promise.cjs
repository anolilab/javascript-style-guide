// @see https://github.com/xjamundx/eslint-plugin-promise#readme
module.exports = {
    extends: ["plugin:promise/recommended"],
    plugins: ["promise"],
    rules: {
        "promise/prefer-await-to-callbacks": "off",
        "promise/prefer-await-to-then": "off",
    },
};
