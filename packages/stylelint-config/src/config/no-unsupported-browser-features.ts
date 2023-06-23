import browserslist from "browserslist-config-anolilab";
import { env } from "node:process";

const config = {
    plugins: ["stylelint-no-unsupported-browser-features"],
    rules: {
        "plugin/no-unsupported-browser-features": [
            true,
            {
                browsers: env["NODE_ENV"] !== "production" ? browserslist.modernBrowsers : browserslist.production,
                severity: "warning",
            },
        ],
    },
};

export default config;
