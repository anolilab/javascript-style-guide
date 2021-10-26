const semver = require('semver');

module.exports = {
    plugins: [
        "unicorn"
    ],
    extends: ["plugin:unicorn/recommended"],
    rules: {
        "unicorn/prefer-node-protocol": semver.gte(process.version, 'v16.0.0') ? "error" : "off",
        'unicorn/template-indent': [
            'warn',
            {
                tags: [
                    'outdent',
                    'dedent',
                    'gql',
                    'sql',
                    'html',
                    'styled'
                ],
                functions: [
                    'dedent',
                    'stripIndent'
                ],
                selectors: [],
                comments: [
                    'HTML',
                    'indent'
                ]
            }
        ]
    },
};
