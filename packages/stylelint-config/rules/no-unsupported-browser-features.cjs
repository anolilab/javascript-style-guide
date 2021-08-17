const browserslist = require("browserslist-config-anolilab")

module.exports = {
    plugins: ["stylelint-no-unsupported-browser-features"],
    rules: {
        "plugin/no-unsupported-browser-features": [
            true,
            {
                browsers: browserslist["production"],
            },
        ],
    },
};
