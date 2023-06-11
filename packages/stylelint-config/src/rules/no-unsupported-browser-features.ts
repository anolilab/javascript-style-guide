import browserslist from "browserslist-config-anolilab";

const config = {
    plugins: ["stylelint-no-unsupported-browser-features"],
    rules: {
        "plugin/no-unsupported-browser-features": [
            true,
            {
                browsers: browserslist.production,
            },
        ],
    },
};

export default config;
