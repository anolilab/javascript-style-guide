import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import indent from "../../utils/indent";

if (!global.hasAnolilabEsLintConfigPrettier && (hasDependency("prettier") || hasDevDependency("prettier"))) {
    global.hasAnolilabEsLintConfigPrettier = true;
}

if (global.hasAnolilabEsLintConfigPrettier) {
    global.anolilabEslintConfigHtmlPrettierRules = {
        "@html-eslint/element-newline": "off",
        "@html-eslint/indent": "off",
        "@html-eslint/no-extra-spacing-attrs": "off",
        "@html-eslint/quotes": "off",
    };

    global.anolilabEslintConfigHtmlPrettierSettings = {
        "html/report-bad-indent": "off",
    };
}

let settings: Linter.Config["settings"] = {};

if (!global.hasAnolilabEsLintConfigPrettier) {
    settings = {
        "html/indent": `+${indent}`,
    };
}

const config: Linter.Config = {
    overrides: [
        {
            extends: ["plugin:@html-eslint/recommended"],
            files: ["*.erb", "*.handlebars", "*.hbs", "*.htm", "*.html", "*.mustache", "*.nunjucks", "*.php", "*.tag", "*.twig", "*.we"],
            globals: {
                sourceCode: true,
            },
            env: {
                browser: true,
                node: false,
            },
            parser: "@html-eslint/parser",
            plugins: ["html", "@html-eslint"],
            rules: {
                "@html-eslint/indent": ["error", indent],
                "capitalized-comments": "off",
                // @see https://github.com/yeonjuan/html-eslint/issues/67 bug in html-eslint
                "spaced-comment": "off",

                ...global.anolilabEslintConfigHtmlPrettierRules,
            },
            settings: {
                "html/report-bad-indent": "error",
                ...settings,
                ...global.anolilabEslintConfigHtmlPrettierSettings,
            },
        },
    ],
};

export default config;
