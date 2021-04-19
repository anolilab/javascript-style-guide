const lodash = {
    plugins: ["lodash"],
    rules: {
        // Possible Errors
        "lodash/callback-binding": 2,
        "lodash/collection-method-value": 2,
        "lodash/collection-return": 2,
        "lodash/no-double-unwrap": 2,
        "lodash/no-extra-args": 2,
        "lodash/no-unbound-this": 2,
        "lodash/unwrap": 2,

        // Disable stylistic rules = Use prettier
        "lodash/chain-style": [2, "as-needed"],
        "lodash/chaining": 2,
        "lodash/collection-ordering": 2,
        "lodash/consistent-compose": [2, "flow"],
        "lodash/identity-shorthand": [2, "always"],
        "lodash/import-scope": [2],
        "lodash/matches-prop-shorthand": [2, "always"],
        "lodash/matches-shorthand": [2, "always", 3],
        "lodash/no-commit": 2,
        "lodash/path-style": [2, "string"],
        "lodash/prefer-compact": 2,
        "lodash/prefer-filter": [2, 3],
        "lodash/prefer-find": 2,
        "lodash/prefer-flat-map": 2,
        "lodash/prefer-immutable-method": 2,
        "lodash/prefer-invoke-map": 2,
        "lodash/prefer-map": 2,
        "lodash/prefer-noop": 2,
        "lodash/prefer-reject": [2, 3],
        "lodash/prefer-thru": 2,
        "lodash/prefer-wrapper-method": 2,
        "lodash/preferred-alias": 2,
        "lodash/prop-shorthand": [2, "always"],

        // Prefer over Native - DISABLED
        "lodash/prefer-constant": 0,
        "lodash/prefer-get": 0,
        "lodash/prefer-includes": 0,
        "lodash/prefer-is-nil": 0,
        "lodash/prefer-lodash-chain": 0,
        "lodash/prefer-lodash-method": 0,
        "lodash/prefer-lodash-typecheck": 0,
        "lodash/prefer-matches": 0,
        "lodash/prefer-over-quantifier": 0,
        "lodash/prefer-some": 0,
        "lodash/prefer-startswith": 0,
        "lodash/prefer-times": 0,
    },
};

export default lodash
