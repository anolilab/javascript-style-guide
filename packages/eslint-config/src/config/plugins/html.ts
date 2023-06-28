import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import styleConfig from "../style";

const styleRules = styleConfig.rules as Linter.RulesRecord;

let hasPrettier = false;

let prettierRules: Linter.RulesRecord = {};

if (hasDependency("prettier") || hasDevDependency("prettier")) {
    hasPrettier = true;

    prettierRules = {
        "@html-eslint/no-extra-spacing-attrs": "off",
        "@html-eslint/element-newline": "off",
        "@html-eslint/quotes": "off",
    };
}

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.erb", "*.handlebars", "*.hbs", "*.htm", "*.html", "*.mustache", "*.nunjucks", "*.php", "*.tag", "*.twig", "*.we"],
            plugins: ["html", "@html-eslint"],
            parser: "@html-eslint/parser",
            extends: ["plugin:@html-eslint/recommended"],
            globals: {
                sourceCode: true,
            },
            settings: {
                "html/indent": `+${(styleRules["indent"] as any[])[1]}`,
                "html/report-bad-indent": hasPrettier ? "off" : "error",
            },
            rules: {
                // @see https://github.com/yeonjuan/html-eslint/issues/67 bug in html-eslint
                "spaced-comment": "off",
                "capitalized-comments": "off",
                "@html-eslint/indent": hasPrettier ? "off" : ["error", (styleRules["indent"] as any[])[1]],

                ...prettierRules,
            },
        },
    ],
};

export default config;
