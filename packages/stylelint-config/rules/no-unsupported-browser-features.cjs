const browserslist = require("browserslist")

module.exports = {
    plugins: ["stylelint-no-unsupported-browser-features"],
    rules: {
        "plugin/no-unsupported-browser-features": [
            true,
            {
                browsers: browserslist(),
            },
        ],
    },
};
