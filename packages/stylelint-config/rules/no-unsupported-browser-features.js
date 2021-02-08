module.exports = {
    plugins: ["stylelint-no-unsupported-browser-features"],
    rules: {
        "plugin/no-unsupported-browser-features": [
            true,
            {
                browsers: require.resolve("browserslist-config-anolilab"),
            },
        ],
    },
};
