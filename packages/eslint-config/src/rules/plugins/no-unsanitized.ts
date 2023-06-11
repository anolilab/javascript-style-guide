// @see https://github.com/mozilla/eslint-plugin-no-unsanitized
const config = {
    plugins: ["no-unsanitized"],
    rules: {
        "no-unsanitized/method": "error",
        "no-unsanitized/property": "error",
    },
};

export default config;
