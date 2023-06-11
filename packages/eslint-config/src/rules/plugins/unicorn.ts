const semver = require("semver");

const config = {
    plugins: ["unicorn"],
    extends: ["plugin:unicorn/recommended"],
    rules: {
        // eslint-disable-next-line no-undef
        "unicorn/prefer-node-protocol": semver.gte(process.version, "v16.0.0") ? "error" : "off",
        "unicorn/template-indent": [
            "warn",
            {
                tags: ["outdent", "dedent", "gql", "sql", "html", "styled"],
                functions: ["dedent", "stripIndent"],
                selectors: [],
                comments: ["HTML", "indent"],
            },
        ],
        "unicorn/no-array-for-each": "off",
    },
};

export default config;
