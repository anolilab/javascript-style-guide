import { packageIsTypeModule } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";
import semver from "semver";

// @see https://github.com/sindresorhus/eslint-plugin-unicorn
const config: Linter.Config = {
    plugins: ["unicorn"],
    extends: ["plugin:unicorn/recommended"],
    rules: {
        // eslint-disable-next-line no-undef
        "unicorn/prefer-node-protocol": semver.gte(process.version, "v16.0.0") ? "error" : "off",
        "unicorn/template-indent": [
            "warn",
            {
                tags: [
"outdent",
"dedent",
"gql",
"sql",
"html",
"styled",
],
                functions: ["dedent", "stripIndent"],
                selectors: [],
                comments: ["HTML", "indent"],
            },
        ],
        "unicorn/no-array-for-each": "off",
        "unicorn/prefer-module": packageIsTypeModule ? "error" : "off",
    },
};

export default config;
