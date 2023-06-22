import { isPackageAvailable, showMissingPackages } from "@anolilab/package-json-utils";
// @ts-expect-error TS2305: Module '"@babel/helper-plugin-utils"' has no exported member 'declarePreset'.
import { declare } from "@babel/helper-plugin-utils";

type BabelAPI = {
    assertVersion: (version: string) => void;
    env: (environment: string) => boolean;
    cache: {
        using: (function_: () => boolean) => boolean;
    };
};

type Options = {
    modules?: "auto" | false | true;
    targets?: any;
    removePropTypes?: boolean | object;
    loose?: boolean;
    looseClasses?: boolean;
    looseObjectRestSpread?: boolean;
    looseComputedProperties?: boolean;
    looseParameters?: boolean;
    looseTemplateLiterals?: boolean;
    typescript?: boolean;
    react?: boolean | object;
    polyfillRegenerator?: boolean;
    useBuiltIns?: boolean;
    corejs?: boolean | { method?: string; version?: number };
    debug?: boolean;
    development?: boolean;
};

const babelPresetTypescript = "@babel/preset-typescript";
const babelPluginTransformTypescript = "@babel/plugin-transform-typescript";
const babelPluginSyntaxJSX = "@babel/plugin-syntax-jsx";
const babelPresetReact = "@babel/preset-react";
const babelPluginTransformReactRemovePropertyTypes = "babel-plugin-transform-react-remove-prop-types";

// eslint-disable-next-line sonarjs/cognitive-complexity,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
const preset = declare((api: BabelAPI, options: Options): Record<string, any> => {
    // see docs about api at https://babeljs.io/docs/en/config-files#apicache
    api.assertVersion("^7.13");

    const {
        modules = "auto",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

    if (typeof modules === "boolean" && typeof modules === "string") {
        throw new TypeError('@anolilab/babel-preset only accepts `true`, `false`, or `"auto"` as the value of the "modules" option');
    }

    if (removePropertyTypes && !react) {
        throw new Error("removePropTypes can't be enabled if react is disabled.");
    }

    const install: string[] = [];

    if (typescript) {
        if (!isPackageAvailable(babelPresetTypescript)) {
            install.push(babelPresetTypescript);
        }

        if (!isPackageAvailable(babelPluginTransformTypescript)) {
            install.push(babelPluginTransformTypescript);
        }

        if (!isPackageAvailable(babelPluginSyntaxJSX)) {
            install.push(babelPluginSyntaxJSX);
        }
    }

    if (react) {
        if (!isPackageAvailable(babelPresetReact)) {
            install.push(babelPresetReact);
        }

        if (removePropertyTypes && !isPackageAvailable(babelPluginTransformReactRemovePropertyTypes)) {
            install.push(babelPluginTransformReactRemovePropertyTypes);
        }
    }

    if (install.length > 0) {
        showMissingPackages("@anolilab/babel-preset", install);
    }

    const debug = typeof options.debug === "boolean" ? options.debug : false;
    const development = typeof options.development === "boolean" ? options.development : api.cache.using(() => process.env["NODE_ENV"] === "development");

    const presets = [
        [
            "@babel/preset-env",
            {
                debug,
                bugfixes: true,
                useBuiltIns,
                exclude: ["transform-async-to-generator", "transform-regenerator"],
                modules: modules === false ? false : "auto",
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    ].filter(Boolean) as [string, object?][];

    const plugins = [
        "@babel/plugin-transform-shorthand-properties",
        "@babel/plugin-transform-block-scoping",
        "babel-plugin-annotate-pure-calls",
        "babel-plugin-dev-expression",
        "@babel/plugin-proposal-class-static-block",
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
        [
            "@babel/plugin-transform-computed-properties",
            {
                loose: looseComputedProperties,
            },
        ],
        [
            "@babel/plugin-transform-parameters",
            {
                loose: looseParameters,
            },
        ],
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
                      ...(removePropertyTypes as object),
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
        "@babel/plugin-syntax-async-generators",
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
                      method: corejs.method ?? "usage-global",
                      absoluteImports: "core-js",
                      version: corejs.version,
                      ...corejs,
                  },
              ]
            : undefined,
    ].filter(Boolean) as [string, object?][];

    return {
        assumptions: {
            noDocumentAll: true,
        },
        presets,
        plugins,
    };
});

export default preset;
