const { declare } = require("@babel/helper-plugin-utils");
const isModuleAvailable = require('./lib/is-module-available');
const missing = require('./lib/missing');

module.exports = declare((api, options) => {
    // see docs about api at https://babeljs.io/docs/en/config-files#apicache
    api.assertVersion("^7.0.0");

    const {
        modules = "auto",
        targets = null,
        removePropTypes = false,
        looseClasses = false,
        looseComputedProperties = false,
        looseParameters = false,
        looseTemplateLiterals = false,
        typescript = false,
        react = false,
        transformRuntime = true,
        runtimeVersion,
        runtimeHelpersUseESModules = !modules,
    } = options;

    if (typeof modules !== "undefined" && typeof modules !== "boolean" && modules !== "auto") {
        throw new TypeError(
            '@anolilab/babel-preset only accepts `true`, `false`, or `"auto"` as the value of the "modules" option',
        );
    }

    if (removePropTypes && !react) {
        throw new Error('"removePropTypes" can\'t be enabled if react is disabled.')
    }

    let install = []

    if (typescript) {
        if (!isModuleAvailable('@babel/preset-typescript')) {
            install.push('@babel/preset-typescript')
        }

        if (!isModuleAvailable('@babel/plugin-transform-typescript')) {
            install.push('@babel/plugin-transform-typescript')
        }

        if (!isModuleAvailable('@babel/plugin-syntax-jsx')) {
            install.push('@babel/plugin-syntax-jsx')
        }
    }

    if (react) {
        if (!isModuleAvailable('@babel/preset-react')) {
            install.push('@babel/preset-react')
        }

        if (removePropTypes && !isModuleAvailable('babel-plugin-transform-react-remove-prop-types')) {
            install.push('babel-plugin-transform-react-remove-prop-types')
        }
    }

    if (install.length !== 0) {
        missing(install)
    }

    const debug = typeof options.debug === "boolean" ? options.debug : false;
    const development =
        typeof options.development === "boolean"
            ? options.development
            : api.cache.using(() => process.env.NODE_ENV === "development");

    return {
        presets: [
            [
                require("@babel/preset-env"),
                {
                    debug,
                    exclude: ["transform-async-to-generator", "transform-regenerator"],
                    modules: modules === false ? false : "auto",
                    targets: targets,
                },
            ],
            typescript
                ? [
                      require("@babel/preset-typescript"),
                      {
                          allExtensions: true,
                          isTSX: true,
                      },
                  ]
                : null,
            react ? [require("@babel/preset-react"), { development }] : null,
        ].filter(Boolean),
        plugins: [
            // class { handleClick = () => { } }
            // Enable loose mode to use assignment instead of defineProperty
            // See discussion in https://github.com/facebook/create-react-app/issues/4263
            [
                require("@babel/plugin-proposal-class-properties"),
                {
                    loose: true,
                },
            ],
            looseClasses
                ? [
                      require("@babel/plugin-transform-classes"),
                      {
                          loose: true,
                      },
                  ]
                : null,
            [
                require("@babel/plugin-proposal-decorators"),
                {
                    legacy: true,
                },
            ],
            // https://babeljs.io/docs/en/babel-plugin-transform-computed-properties#loose
            looseComputedProperties
                ? [
                      require("@babel/plugin-transform-computed-properties"),
                      {
                          loose: true,
                      },
                  ]
                : null,
            // https://babeljs.io/docs/en/babel-plugin-transform-parameters#loose
            looseParameters
                ? [
                      require("@babel/plugin-transform-parameters"),
                      {
                          loose: true,
                      },
                  ]
                : null,
            // https://babeljs.io/docs/en/next/babel-plugin-transform-template-literals.html#loose
            looseTemplateLiterals
                ? [
                      require("@babel/plugin-transform-template-literals"),
                      {
                          loose: false,
                      },
                  ]
                : null,
            react && removePropTypes
                ? [
                      require("babel-plugin-transform-react-remove-prop-types"),
                      Object.assign(
                          {
                              mode: "wrap",
                              ignoreFilenames: ["node_modules"],
                          },
                          removePropTypes,
                      ),
                  ]
                : null,
            require('@babel/plugin-proposal-export-namespace-from'),
            typescript ? require("@babel/plugin-transform-typescript") : null,
            // Transform dynamic import to require
            [
                require("babel-plugin-dynamic-import-node"),
                {
                    noInterop: true,
                },
            ],
            typescript ? require('@babel/plugin-syntax-jsx') : null,
            // Adds syntax support for import()
            require("@babel/plugin-syntax-dynamic-import"),
            require("@babel/plugin-transform-property-mutators"),
            require("@babel/plugin-transform-member-expression-literals"),
            require("@babel/plugin-transform-property-literals"),
            require("@babel/plugin-proposal-nullish-coalescing-operator"),
            require("@babel/plugin-proposal-numeric-separator"),
            require("@babel/plugin-syntax-bigin"),
            require("@babel/plugin-proposal-optional-catch-binding"),
            require("@babel/plugin-proposal-optional-chaining"),
            [
                require("@babel/plugin-proposal-object-rest-spread"),
                {
                    useBuiltIns: true,
                },
            ],
            // https://babeljs.io/docs/en/babel-plugin-syntax-async-generators
            require("@babel/plugin-syntax-async-generators"),
            // fast-async is a Babel plugin that implements the ES7 keywords async and await
            // using syntax transformation at compile-time, rather than generators.
            require("fast-async"),
            // Experimental macros support. Will be documented after it's had some time
            // in the wild.
            require("babel-plugin-macros"),
            transformRuntime
                ? [
                      require("@babel/plugin-transform-runtime"),
                      {
                          absoluteRuntime: false,
                          corejs: false,
                          helpers: true,
                          regenerator: false,
                          useESModules: runtimeHelpersUseESModules,
                          version: runtimeVersion,
                      },
                  ]
                : null,
        ].filter(Boolean),
    };
});
