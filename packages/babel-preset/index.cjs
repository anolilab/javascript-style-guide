const { declare } = require("@babel/helper-plugin-utils");
const isModuleAvailable = require('./lib/is-module-available.cjs');
const missing = require('./lib/missing.cjs');

module.exports = declare((api, options) => {
    // see docs about api at https://babeljs.io/docs/en/config-files#apicache
    api.assertVersion('^7.13');

    const {
        modules = 'auto',
        targets = null,
        removePropTypes = false,
        looseClasses = true,
        looseObjectRestSpread = true,
        looseComputedProperties = true,
        looseParameters = true,
        looseTemplateLiterals = true,
        typescript = false,
        react = false,
        polyfillRegenerator = false,
        useBuiltIns = false
    } = options;

    if (typeof modules !== 'undefined' && typeof modules !== 'boolean' && modules !== 'auto') {
        throw new TypeError(
            '@anolilab/babel-preset only accepts `true`, `false`, or `"auto"` as the value of the "modules" option',
        );
    }

    if (removePropTypes && !react) {
        throw new Error('removePropTypes can\'t be enabled if react is disabled.')
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

    const debug = typeof options.debug === 'boolean' ? options.debug : false;
    const development =
        typeof options.development === 'boolean'
            ? options.development
            : api.cache.using(() => process.env.NODE_ENV === "development");

    return {
        assumptions: {
            noDocumentAll: true,
        },
        ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
        presets: [
            [
                '@babel/preset-env',
                {
                    debug,
                    bugfixes: true,
                    useBuiltIns,
                    exclude: ['transform-async-to-generator', 'transform-regenerator'],
                    modules: modules === false ? false : 'auto',
                    targets: targets,
                    shippedProposals: api.env('modern'),
                },
            ],
            typescript
                ? [
                      '@babel/preset-typescript',
                      {
                          allExtensions: true,
                          isTSX: true,
                      },
                  ]
                : null,
            react ? ['@babel/preset-react', Object.assign({ development }, typeof react === "object" ? react : {})] : null,
        ].filter(Boolean),
        plugins: [
            'babel-plugin-annotate-pure-calls',
            'babel-plugin-dev-expression',
            '@babel/plugin-proposal-class-static-block',
            // class { handleClick = () => { } }
            // Enable loose mode to use assignment instead of defineProperty
            // See discussion in https://github.com/facebook/create-react-app/issues/4263
            [
                '@babel/plugin-proposal-class-properties',
                {
                    loose: looseClasses,
                },
            ],
            [
                '@babel/plugin-proposal-private-methods',
                {
                    loose: looseClasses,
                },
            ],
            [
                '@babel/plugin-proposal-private-property-in-object',
                {
                    loose: looseClasses,
                },
            ],
            looseClasses
                ? [
                      '@babel/plugin-transform-classes',
                      {
                          loose: true,
                      },
                  ]
                : null,
            [
                '@babel/plugin-proposal-decorators',
                {
                    legacy: true,
                },
            ],
            // https://babeljs.io/docs/en/babel-plugin-transform-computed-properties#loose
            looseComputedProperties
                ? [
                      '@babel/plugin-transform-computed-properties',
                      {
                          loose: true,
                      },
                  ]
                : null,
            // https://babeljs.io/docs/en/babel-plugin-transform-parameters#loose
            looseParameters
                ? [
                      '@babel/plugin-transform-parameters',
                      {
                          loose: true,
                      },
                  ]
                : null,
            // https://babeljs.io/docs/en/next/babel-plugin-transform-template-literals.html#loose
            looseTemplateLiterals
                ? [
                      '@babel/plugin-transform-template-literals',
                      {
                          loose: false,
                      },
                  ]
                : null,
            looseObjectRestSpread
                ? [
                    '@babel/plugin-proposal-object-rest-spread',
                    {
                        loose: true,
                        useBuiltIns: true,
                    },
                ] : null,
            react && removePropTypes
                ? [
                      'babel-plugin-transform-react-remove-prop-types',
                      Object.assign(
                          {
                              mode: 'unsafe-wrap',
                              ignoreFilenames: ['node_modules'],
                          },
                          removePropTypes,
                      ),
                  ]
                : null,
            '@babel/plugin-proposal-export-namespace-from',
            typescript ? '@babel/plugin-transform-typescript' : null,
            typescript ? '@babel/plugin-syntax-jsx' : null,
            '@babel/plugin-transform-property-mutators',
            '@babel/plugin-transform-member-expression-literals',
            '@babel/plugin-transform-property-literals',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-numeric-separator',
            '@babel/plugin-proposal-optional-catch-binding',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-syntax-bigint',
            // https://babeljs.io/docs/en/babel-plugin-syntax-async-generators
            '@babel/plugin-syntax-async-generators',
            // Experimental macros support. Will be documented after it's had some time
            // in the wild.
            'babel-plugin-macros',
            polyfillRegenerator ? [
                'babel-plugin-polyfill-regenerator',
                {
                    method: 'usage-pure'
                }
            ]: null
        ].filter(Boolean),
    };
});
