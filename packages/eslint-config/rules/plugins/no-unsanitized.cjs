// @see https://github.com/mozilla/eslint-plugin-no-unsanitized
module.exports = {
    plugins: ["no-unsanitized"],
    rules: {
        "no-unsanitized/method": "error",
        "no-unsanitized/property": "error",
    },
};
