// @see https://github.com/mozilla/eslint-plugin-no-unsanitized
const noUnsanitized = {
    plugins: ["no-unsanitized"],
    rules: {
        "no-unsanitized/method": "error",
        "no-unsanitized/property": "error",
    },
};

export default noUnsanitized
