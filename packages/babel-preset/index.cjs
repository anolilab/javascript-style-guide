const { declare } = require("@babel/helper-plugin-utils");
const isModuleAvailable = require("./lib/is-module-available.cjs");
const missing = require("./lib/missing.cjs");

// eslint-disable-next-line radar/cognitive-complexity
module.exports = declare((api, options) => {
    // see docs about api at https://babeljs.io/docs/en/config-files#apicache
    api.assertVersion("^7.13");

    const {
        modules = "auto",
        targets,
        removePropTypes: removePropertyTypes = false,
        loose = true,
        looseClasses = true,
        looseObjectRestSpread = true,
        looseComputedProperties = true,
        looseParameters = true,
        looseTemplateLiterals = true,
        typescript = false,
        react = false,
        polyfillRegenerator = false,
        useBuiltIns = false,
        corejs = false,
    } = options;

    if (modules !== undefined && typeof modules !== "boolean" && modules !== "auto") {
        throw new TypeError(
            '@anolilab/babel-preset only accepts `true`, `false`, or `"auto"` as the value of the "modules" option',
        );
    }

    if (removePropertyTypes && !react) {
        throw new Error("removePropTypes can't be enabled if react is disabled.");
    }

    const install = [];

    if (typescript) {
        // eslint-disable-next-line radar/no-duplicate-string
        if (!isModuleAvailable("@babel/preset-typescript")) {
            install.push("@babel/preset-typescript");
        }

        // eslint-disable-next-line radar/no-duplicate-string
        if (!isModuleAvailable("@babel/plugin-transform-typescript")) {
            install.push("@babel/plugin-transform-typescript");
        }

        // eslint-disable-next-line radar/no-duplicate-string
        if (!isModuleAvailable("@babel/plugin-syntax-jsx")) {
            install.push("@babel/plugin-syntax-jsx");
        }
    }

    if (react) {
        // eslint-disable-next-line radar/no-duplicate-string
        if (!isModuleAvailable("@babel/preset-react")) {
            install.push("@babel/preset-react");
        }

        // eslint-disable-next-line radar/no-duplicate-string
        if (removePropertyTypes && !isModuleAvailable("babel-plugin-transform-react-remove-prop-types")) {
            install.push("babel-plugin-transform-react-remove-prop-types");
        }
    }

    if (install.length > 0) {
        missing(install);
    }

    const debug = typeof options.debug === "boolean" ? options.debug : false;
    const development = typeof options.development === "boolean"
        ? options.development
        // eslint-disable-next-line operator-linebreak
        : // eslint-disable-next-line no-undef
        api.cache.using(() => process.env.NODE_ENV === "development");

    return {
        assumptions: {
            noDocumentAll: true,
        },
        presets: [
            [
                "@babel/preset-env",
                {
                    debug,
                    bugfixes: true,
                    useBuiltIns,
                    exclude: ["transform-async-to-generator", "transform-regenerator"],
                    modules: modules === false ? false : "auto",
                    targets,
                    shippedProposals: api.env("modern"),
                    loose,
                },
            ],
            typescript
                ? [
                    "@babel/preset-typescript",
                    {
                        allExtensions: true,
                        isTSX: true,
                    },
                ]
                : undefined,
            react ? ["@babel/preset-react", { development, ...(typeof react === "object" ? react : {}) }] : undefined,
        ].filter(Boolean),
        plugins: [
            "@babel/plugin-transform-shorthand-properties",
            "@babel/plugin-transform-block-scoping",
            "babel-plugin-annotate-pure-calls",
            "babel-plugin-dev-expression",
            "@babel/plugin-proposal-class-static-block",
            // class { handleClick = () => { } }
            // Enable loose mode to use assignment instead of defineProperty
            // See discussion in https://github.com/facebook/create-react-app/issues/4263
            [
                "@babel/plugin-proposal-class-properties",
                {
                    loose: looseClasses,
                },
            ],
            [
                "@babel/plugin-proposal-private-methods",
                {
                    loose: looseClasses,
                },
            ],
            [
                "@babel/plugin-proposal-private-property-in-object",
                {
                    loose: looseClasses,
                },
            ],
            // https://babeljs.io/docs/en/babel-plugin-transform-classes
            [
                "@babel/plugin-transform-classes",
                {
                    loose: looseClasses,
                },
            ],
            [
                "@babel/plugin-proposal-decorators",
                {
                    legacy: true,
                },
            ],
            // https://babeljs.io/docs/en/babel-plugin-transform-computed-properties#loose
            [
                "@babel/plugin-transform-computed-properties",
                {
                    loose: looseComputedProperties,
                },
            ],
            // https://babeljs.io/docs/en/babel-plugin-transform-parameters#loose
            [
                "@babel/plugin-transform-parameters",
                {
                    loose: looseParameters,
                },
            ],
            // https://babeljs.io/docs/en/next/babel-plugin-transform-template-literals.html#loose
            [
                "@babel/plugin-transform-template-literals",
                {
                    loose: looseTemplateLiterals,
                },
            ],
            [
                "@babel/plugin-proposal-object-rest-spread",
                {
                    loose: looseObjectRestSpread,
                    useBuiltIns,
                },
            ],
            react && removePropertyTypes
                ? [
                    "babel-plugin-transform-react-remove-prop-types",
                    {
                        mode: "unsafe-wrap",
                        ignoreFilenames: ["node_modules"],
                        ...removePropertyTypes,
                    },
                ]
                : undefined,
            "@babel/plugin-proposal-export-namespace-from",
            typescript ? "@babel/plugin-transform-typescript" : undefined,
            typescript ? "@babel/plugin-syntax-jsx" : undefined,
            "@babel/plugin-transform-property-mutators",
            "@babel/plugin-transform-member-expression-literals",
            "@babel/plugin-transform-property-literals",
            "@babel/plugin-transform-for-of",
            "@babel/plugin-transform-arrow-functions",
            "@babel/plugin-transform-destructuring",
            "@babel/plugin-transform-spread",
            "@babel/plugin-proposal-nullish-coalescing-operator",
            "@babel/plugin-proposal-numeric-separator",
            "@babel/plugin-proposal-optional-catch-binding",
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-proposal-export-default-from",
            "@babel/plugin-syntax-bigint",
            // https://babeljs.io/docs/en/babel-plugin-syntax-async-generators
            "@babel/plugin-syntax-async-generators",
            // Experimental macros support. Will be documented after it's had some time
            // in the wild.
            "babel-plugin-macros",
            polyfillRegenerator
                ? [
                    "babel-plugin-polyfill-regenerator",
                    {
                        method: "usage-pure",
                    },
                ]
                : undefined,
            typeof corejs === "object"
                ? [
                    "babel-plugin-polyfill-corejs3",
                    {
                        method: corejs.method || "usage-global",
                        absoluteImports: "core-js",
                        version: corejs.version,
                        ...corejs,
                    },
                ]
                : undefined,
        ].filter(Boolean),
    };
});
