import { hasPackageJsonAnyDependency } from "@visulima/package";
import { readTsConfig } from "@visulima/tsconfig";
import type { Rule } from "eslint";
import { parse } from "semver";

import type {
    OptionsFiles,
    OptionsHasPrettier,
    OptionsOverrides,
    OptionsPackageJson,
    OptionsSilentConsoleLogs,
    OptionsStylistic,
    OptionsTypeScriptParserOptions,
    OptionsTypeScriptWithTypes,
    TypedFlatConfigItem,
} from "../../types";
import { createConfig, getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import { noUnderscoreDangle } from "../style";

// react refresh
const ReactRefreshAllowConstantExportPackages = ["vite"];
const RemixPackages = ["@remix-run/node", "@remix-run/react", "@remix-run/serve", "@remix-run/dev"];
const NextJsPackages = ["next"];
const ReactRouterPackages = ["@react-router/node", "@react-router/react", "@react-router/serve", "@react-router/dev"];

type PluginReactCompiler = {
    recommended: {
        plugins: {
            "react-compiler": {
                rules: {
                    "react-compiler": Rule.RuleModule;
                };
            };
        };
        rules: {
            "react-compiler/react-compiler": "error";
        };
    };
};

// @see https://github.com/jsx-eslint/eslint-plugin-react
export default createConfig<
    OptionsFiles &
    OptionsHasPrettier &
    OptionsOverrides &
    OptionsPackageJson &
    OptionsSilentConsoleLogs &
    OptionsStylistic &
    OptionsTypeScriptParserOptions &
    OptionsTypeScriptWithTypes & { reactCompiler?: boolean }
    // eslint-disable-next-line sonarjs/cognitive-complexity
>("jsx_and_tsx", async (config, oFiles) => {
    const {
        files = oFiles,
        filesTypeAware = getFilesGlobs("ts"),
        ignoresTypeAware = [`**/*.md/**`, ...getFilesGlobs("astro")],
        overrides,
        packageJson,
        prettier,
        reactCompiler,
        silent,
        stylistic = true,
        tsconfigPath,
    } = config;

    const isTypeAware = tsconfigPath !== undefined;

    const { indent = 4 } = typeof stylistic === "boolean" ? {} : stylistic;

    const typeAwareRules: TypedFlatConfigItem["rules"] = {
        "react-x/no-leaked-conditional-rendering": "error",
    };

    const [pluginReactX, pluginReact, pluginReactHooks, pluginReactRefresh, pluginReactPerf, pluginReactYouMightNotNeedAnEffect] = await Promise.all([
        interopDefault(import("@eslint-react/eslint-plugin")),
        interopDefault(import("eslint-plugin-react")),
        interopDefault(import("eslint-plugin-react-hooks")),
        interopDefault(import("eslint-plugin-react-refresh")),
        interopDefault(import("eslint-plugin-react-perf")),
        interopDefault(import("eslint-plugin-react-you-might-not-need-an-effect")),
    ] as const);

    const isAllowConstantExport = hasPackageJsonAnyDependency(packageJson, ReactRefreshAllowConstantExportPackages);
    const isUsingRemix = hasPackageJsonAnyDependency(packageJson, RemixPackages);
    const isUsingNext = hasPackageJsonAnyDependency(packageJson, NextJsPackages);
    const isUsingReactRouter = hasPackageJsonAnyDependency(packageJson, ReactRouterPackages);

    const { plugins } = pluginReactX.configs.all;

    let reactVersion = packageJson?.["dependencies"]?.["react"] || packageJson?.["devDependencies"]?.["react"];
    let hasReactCompiler = false;

    if (reactVersion !== undefined) {
        const parsedVersion = parse(reactVersion);

        if (parsedVersion !== null) {
            reactVersion = `${parsedVersion.major}.${parsedVersion.minor}`;

            if (!silent) {
                // eslint-disable-next-line no-console
                console.info(
                    `\n@anolilab/eslint-config found the version ${reactVersion} of react in your dependencies, this version ${reactVersion} will be used to setup the "eslint-plugin-react"\n`,
                );
            }
        }

        if (parsedVersion?.major && parsedVersion.major >= 19) {
            hasReactCompiler = true;
        }
    }

    let hasJsxRuntime = false;

    if (tsconfigPath !== undefined) {
        const tsConfig = readTsConfig(tsconfigPath);

        if (tsConfig?.compilerOptions !== undefined && (tsConfig?.compilerOptions.jsx === "react-jsx" || tsConfig?.compilerOptions.jsx === "react-jsxdev")) {
            hasJsxRuntime = true;

            if (!silent) {
                // eslint-disable-next-line no-console
                console.info(`\n@anolilab/eslint-config found react jsx-runtime. \n
  Following rules are disabled: "react/jsx-uses-react" and "react/react-in-jsx-scope".
  If you dont use the new react jsx-runtime in you project, please enable it manually.\n`);
            }
        }
    }

    hasReactCompiler = hasReactCompiler && reactCompiler !== false;

    let pluginReactCompiler: PluginReactCompiler | undefined;

    if (hasReactCompiler) {
        // eslint-disable-next-line no-console
        console.info(`\n@anolilab/eslint-config enabling react-compiler plugin\n`);

        pluginReactCompiler = await interopDefault(import("eslint-plugin-react-compiler")) as unknown as PluginReactCompiler;
    }

    return [
        {
            name: "anolilab/react/setup",
            plugins: {
                react: pluginReact,
                "react-dom": plugins["@eslint-react/dom"],
                "react-hooks": pluginReactHooks,
                "react-hooks-extra": plugins["@eslint-react/hooks-extra"],
                "react-naming-convention": plugins["@eslint-react/naming-convention"],
                "react-perf": pluginReactPerf,
                "react-refresh": pluginReactRefresh,
                "react-web-api": plugins["@eslint-react/web-api"],
                "react-x": plugins["@eslint-react"],
                "react-you-might-not-need-an-effect": pluginReactYouMightNotNeedAnEffect,
                ...hasReactCompiler && pluginReactCompiler ? pluginReactCompiler.recommended.plugins : {},
            },
        },
        {
            files,
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                    },
                },
            },
            name: "anolilab/react/rules",
            // https://github.com/jsx-eslint/eslint-plugin-react#list-of-supported-rules
            rules: {
                "class-methods-use-this": [
                    "error",
                    {
                        exceptMethods: [
                            "render",
                            "getInitialState",
                            "getDefaultProps",
                            "getChildContext",
                            "componentWillMount",
                            "UNSAFE_componentWillMount",
                            "componentDidMount",
                            "componentWillReceiveProps",
                            "UNSAFE_componentWillReceiveProps",
                            "shouldComponentUpdate",
                            "componentWillUpdate",
                            "UNSAFE_componentWillUpdate",
                            "componentDidUpdate",
                            "componentWillUnmount",
                            "componentDidCatch",
                            "getSnapshotBeforeUpdate",
                        ],
                    },
                ],

                // Specify whether double or single quotes should be used in JSX attributes
                // https://eslint.org/docs/rules/jsx-quotes
                "jsx-quotes": ["error", "prefer-double"],

                "no-underscore-dangle": [
                    "error",
                    {
                        ...noUnderscoreDangle,

                        allow: [...noUnderscoreDangle.allow, "__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"],
                    },
                ],

                // Disallow direct calls to the set function of useState in useEffect
                // https://eslint-react.xyz/docs/rules/no-direct-set-state-in-use-effect
                "react-hooks-extra/no-direct-set-state-in-use-effect": "error",

                // Disallow unnecessary usage of useCallback
                // https://eslint-react.xyz/docs/rules/hooks-extra-no-unnecessary-use-callback
                "react-hooks-extra/no-unnecessary-use-callback": "error",

                // Disallow unnecessary usage of useMemo
                // https://eslint-react.xyz/docs/rules/react-hooks-extra/no-unnecessary-use-memo
                "react-hooks-extra/no-unnecessary-use-memo": "error",

                // Enforces that a function with the use prefix should use at least one hook inside of it
                // https://eslint-react.xyz/docs/rules/no-unnecessary-use-prefix
                "react-hooks-extra/no-unnecessary-use-prefix": "error",

                // Prefer lazy initialization for useState
                // https://eslint-react.xyz/docs/rules/prefer-use-state-lazy-initialization
                "react-hooks-extra/prefer-use-state-lazy-initialization": "error",

                // Enforce Rules of Hooks
                // https://github.com/facebook/react/blob/1204c789776cb01fbaf3e9f032e7e2ba85a44137/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js
                "react-hooks/exhaustive-deps": "error",

                // Verify the list of the dependencies for Hooks like useEffect and similar
                // https://github.com/facebook/react/blob/c11015ff4f610ac2924d1fc6d569a17657a404fd/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js
                "react-hooks/rules-of-hooks": "error",

                // Enforces naming conventions for components
                // https://eslint-react.xyz/docs/rules/naming-convention-component-name
                "react-naming-convention/component-name": "error",

                // Enforces context name to be a valid component name with the suffix Context
                // https://eslint-react.xyz/docs/rules/naming-convention-context-name
                "react-naming-convention/context-name": "error",

                // Enforces consistent file naming conventions
                // https://eslint-react.xyz/docs/rules/naming-convention-filename
                "react-naming-convention/filename": "off",

                // Enforces naming conventions for useState
                // https://eslint-react.xyz/docs/rules/naming-convention-use-state
                "react-naming-convention/use-state": "error",

                // react refresh
                "react-refresh/only-export-components": [
                    "error",
                    {
                        allowConstantExport: isAllowConstantExport,
                        allowExportNames: [
                            ...isUsingNext
                                ? [
                                    "dynamic",
                                    "dynamicParams",
                                    "revalidate",
                                    "fetchCache",
                                    "runtime",
                                    "preferredRegion",
                                    "maxDuration",
                                    "config",
                                    "generateStaticParams",
                                    "metadata",
                                    "generateMetadata",
                                    "viewport",
                                    "generateViewport",
                                ]
                                : [],
                            ...isUsingRemix || isUsingReactRouter ? ["meta", "links", "headers", "loader", "action"] : [],
                        ],
                    },
                ],

                // Prevents leaked addEventListener in a component or custom hook
                // https://eslint-react.xyz/docs/rules/web-api-no-leaked-event-listener
                "react-web-api/no-leaked-event-listener": "error",

                // Prevents leaked setInterval in a component or custom hook
                // https://eslint-react.xyz/docs/rules/web-api-no-leaked-interval
                "react-web-api/no-leaked-interval": "error",

                // Prevents leaked ResizeObserver in a component or custom hook
                // https://eslint-react.xyz/docs/rules/web-api-no-leaked-resize-observer
                "react-web-api/no-leaked-resize-observer": "error",

                // Prevents leaked setTimeout in a component or custom hook
                // https://eslint-react.xyz/docs/rules/web-api-no-leaked-timeout
                "react-web-api/no-leaked-timeout": "error",

                // React-X Rules
                // https://eslint-react.xyz/docs/rules

                // Enforces explicit boolean values for boolean attributes
                // https://eslint-react.xyz/docs/rules/avoid-shorthand-boolean
                "react-x/avoid-shorthand-boolean": "off",

                // Enforces explicit <Fragment> components instead of the shorthand <> or </> syntax
                // https://eslint-react.xyz/docs/rules/avoid-shorthand-fragment
                "react-x/avoid-shorthand-fragment": "off",

                // Enforces that the key attribute is placed before the spread attribute in JSX elements
                // https://eslint-react.xyz/docs/rules/jsx-key-before-spread
                "react-x/jsx-key-before-spread": "error",

                // Disallow duplicate props in JSX elements
                // https://eslint-react.xyz/docs/rules/jsx-no-duplicate-props
                "react-x/jsx-no-duplicate-props": "error",

                // Disallow undefined variables in JSX elements
                // https://eslint-react.xyz/docs/rules/jsx-no-undef
                "react-x/jsx-no-undef": "off",

                // Marks React variables as used when JSX is used
                // https://eslint-react.xyz/docs/rules/jsx-uses-react
                "react-x/jsx-uses-react": hasJsxRuntime ? "off" : "error",

                // Marks variables used in JSX elements as used
                // https://eslint-react.xyz/docs/rules/jsx-uses-vars
                "react-x/jsx-uses-vars": "error",

                // Disallow accessing this.state inside setState calls
                // https://eslint-react.xyz/docs/rules/no-access-state-in-setstate
                "react-x/no-access-state-in-setstate": "error",

                // Disallow an item's index in the array as its key
                // https://eslint-react.xyz/docs/rules/no-array-index-key
                "react-x/no-array-index-key": "error",

                // Disallow Children.count
                // https://eslint-react.xyz/docs/rules/no-children-count
                "react-x/no-children-count": "error",

                // Disallow Children.forEach
                // https://eslint-react.xyz/docs/rules/no-children-for-each
                "react-x/no-children-for-each": "error",

                // Disallow Children.map
                // https://eslint-react.xyz/docs/rules/no-children-map
                "react-x/no-children-map": "error",

                // Disallow Children.only
                // https://eslint-react.xyz/docs/rules/no-children-only
                "react-x/no-children-only": "error",

                // Disallow passing children as a prop
                // https://eslint-react.xyz/docs/rules/no-children-prop
                "react-x/no-children-prop": "off",

                // Disallow Children.toArray
                // https://eslint-react.xyz/docs/rules/no-children-to-array
                "react-x/no-children-to-array": "error",

                // Disallow class components except for error boundaries
                // https://eslint-react.xyz/docs/rules/no-class-component
                "react-x/no-class-component": "off",

                // Disallow cloneElement
                // https://eslint-react.xyz/docs/rules/no-clone-element
                "react-x/no-clone-element": "error",

                // Prevents comments from being inserted as text nodes
                // https://eslint-react.xyz/docs/rules/no-comment-textnodes
                "react-x/no-comment-textnodes": "error",

                // Disallow complex conditional rendering in JSX expressions
                // https://eslint-react.xyz/docs/rules/no-complex-conditional-rendering
                "react-x/no-complex-conditional-rendering": "off",

                // Replaces usages of componentWillMount with UNSAFE_componentWillMount
                // https://eslint-react.xyz/docs/rules/no-component-will-mount
                "react-x/no-component-will-mount": "error",

                // Replaces usages of componentWillReceiveProps with UNSAFE_componentWillReceiveProps
                // https://eslint-react.xyz/docs/rules/no-component-will-receive-props
                "react-x/no-component-will-receive-props": "error",

                // Replaces usages of componentWillUpdate with UNSAFE_componentWillUpdate
                // https://eslint-react.xyz/docs/rules/no-component-will-update
                "react-x/no-component-will-update": "error",

                // Replaces usages of <Context.Provider> with <Context>
                // https://eslint-react.xyz/docs/rules/no-context-provider
                "react-x/no-context-provider": "error",

                // Disallow createRef in function components
                // https://eslint-react.xyz/docs/rules/no-create-ref
                "react-x/no-create-ref": "error",

                // Disallow defaultProps property in favor of ES6 default parameters
                // https://eslint-react.xyz/docs/rules/no-default-props
                "react-x/no-default-props": "error",

                // Disallow direct mutation of this.state
                // https://eslint-react.xyz/docs/rules/no-direct-mutation-state
                "react-x/no-direct-mutation-state": "error",

                // Disallow duplicate key on elements in the same array or a list of children
                // https://eslint-react.xyz/docs/rules/no-duplicate-key
                "react-x/no-duplicate-key": "error",

                // Replaces usages of forwardRef with passing ref as a prop
                // https://eslint-react.xyz/docs/rules/no-forward-ref
                "react-x/no-forward-ref": "error",

                // Prevents key from not being explicitly specified (e.g. spreading key from objects)
                // https://eslint-react.xyz/docs/rules/no-implicit-key
                "react-x/no-implicit-key": "error",

                // Prevents problematic leaked values from being rendered
                // https://eslint-react.xyz/docs/rules/no-leaked-conditional-rendering
                "react-x/no-leaked-conditional-rendering": "error",

                // Enforces that all components have a displayName which can be used in devtools
                // https://eslint-react.xyz/docs/rules/no-missing-component-display-name
                "react-x/no-missing-component-display-name": "off",

                // Enforces that all contexts have a displayName which can be used in devtools
                // https://eslint-react.xyz/docs/rules/no-missing-context-display-name
                "react-x/no-missing-context-display-name": "off",

                // Disallow missing key on items in list rendering
                // https://eslint-react.xyz/docs/rules/no-missing-key
                "react-x/no-missing-key": "error",

                // Prevents incorrect usage of captureOwnerStack
                // https://eslint-react.xyz/docs/rules/no-misused-capture-owner-stack
                "react-x/no-misused-capture-owner-stack": "off",

                // Disallow nesting component definitions inside other components
                // https://eslint-react.xyz/docs/rules/no-nested-component-definitions
                "react-x/no-nested-component-definitions": "error",

                // Disallow nesting lazy component declarations inside other components
                // https://eslint-react.xyz/docs/rules/no-nested-lazy-component-declarations
                "react-x/no-nested-lazy-component-declarations": "error",

                // Disallow propTypes in favor of TypeScript or another type-checking solution
                // https://eslint-react.xyz/docs/rules/no-prop-types
                "react-x/no-prop-types": "error",

                // Disallow shouldComponentUpdate when extending React.PureComponent
                // https://eslint-react.xyz/docs/rules/no-redundant-should-component-update
                "react-x/no-redundant-should-component-update": "error",

                // Disallow calling this.setState in componentDidMount outside of functions, such as callbacks
                // https://eslint-react.xyz/docs/rules/no-set-state-in-component-did-mount
                "react-x/no-set-state-in-component-did-mount": "error",

                // Disallow calling this.setState in componentDidUpdate outside of functions, such as callbacks
                // https://eslint-react.xyz/docs/rules/no-set-state-in-component-did-update
                "react-x/no-set-state-in-component-did-update": "error",

                // Disallow calling this.setState in componentWillUpdate outside of functions, such as callbacks
                // https://eslint-react.xyz/docs/rules/no-set-state-in-component-will-update
                "react-x/no-set-state-in-component-will-update": "error",

                // Replaces string refs with callback refs
                // https://eslint-react.xyz/docs/rules/no-string-refs
                "react-x/no-string-refs": "error",

                // Warns the usage of UNSAFE_componentWillMount in class components
                // https://eslint-react.xyz/docs/rules/no-unsafe-component-will-mount
                "react-x/no-unsafe-component-will-mount": "error",

                // Warns the usage of UNSAFE_componentWillReceiveProps in class components
                // https://eslint-react.xyz/docs/rules/no-unsafe-component-will-receive-props
                "react-x/no-unsafe-component-will-receive-props": "error",

                // Warns the usage of UNSAFE_componentWillUpdate in class components
                // https://eslint-react.xyz/docs/rules/no-unsafe-component-will-update
                "react-x/no-unsafe-component-will-update": "error",

                // Prevents non-stable values (i.e. object literals) from being used as a value for Context.Provider
                // https://eslint-react.xyz/docs/rules/no-unstable-context-value
                "react-x/no-unstable-context-value": "error",

                // Prevents using referential-type values as default props in object destructuring
                // https://eslint-react.xyz/docs/rules/no-unstable-default-props
                "react-x/no-unstable-default-props": "error",

                // Warns unused class component methods and properties
                // https://eslint-react.xyz/docs/rules/no-unused-class-component-members
                "react-x/no-unused-class-component-members": "error",

                // Warns unused class component state
                // https://eslint-react.xyz/docs/rules/no-unused-state
                "react-x/no-unused-state": "error",

                // Replaces usages of useContext with use
                // https://eslint-react.xyz/docs/rules/no-use-context
                "react-x/no-use-context": "error",

                // Disallow useless forwardRef calls on components that don't use refs
                // https://eslint-react.xyz/docs/rules/no-useless-forward-ref
                "react-x/no-useless-forward-ref": "error",

                // Disallow useless fragment elements
                // https://eslint-react.xyz/docs/rules/no-useless-fragment
                "react-x/no-useless-fragment": "off",

                // Enforces destructuring assignment for component props and context
                // https://eslint-react.xyz/docs/rules/prefer-destructuring-assignment
                "react-x/prefer-destructuring-assignment": "off",

                // Enforces React is imported via a namespace import
                // https://eslint-react.xyz/docs/rules/prefer-react-namespace-import
                "react-x/prefer-react-namespace-import": "off",

                // Enforces read-only props in components
                // https://eslint-react.xyz/docs/rules/prefer-read-only-props
                "react-x/prefer-read-only-props": "off",

                // Enforces shorthand syntax for boolean attributes
                // https://eslint-react.xyz/docs/rules/prefer-shorthand-boolean
                "react-x/prefer-shorthand-boolean": "off",

                // Enforces shorthand syntax for fragments
                // https://eslint-react.xyz/docs/rules/prefer-shorthand-fragment
                "react-x/prefer-shorthand-fragment": "off",

                // Prevent missing displayName in a React component definition
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/boolean-prop-naming.md
                "react/boolean-prop-naming": [
                    "off",
                    {
                        message: "",
                        propTypeNames: ["bool", "mutuallyExclusiveTrueProps"],
                        rule: "^(is|has)[A-Z]([A-Za-z0-9]?)+",
                    },
                ],

                // Forbid certain propTypes (any, array, object)
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
                "react/button-has-type": [
                    "error",
                    {
                        button: true,
                        reset: false,
                        submit: true,
                    },
                ],

                // Forbid certain props on DOM Nodes
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/9e13ae2c51e44872b45cc15bf1ac3a72105bdd0e/docs/rules/default-props-match-prop-types.md
                "react/default-props-match-prop-types": ["error", { allowRequiredDefaults: false }],

                // Enforce boolean attributes notation in JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
                "react/destructuring-assignment": ["error", "always"],

                // Validate closing bracket location in JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md
                "react/display-name": ["off", { ignoreTranspilerName: false }],

                // Enforce or disallow spaces inside curly braces in JSX attributes
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-component-props.md
                "react/forbid-component-props": ["off", { forbid: [] }],

                // Enforce event handler naming conventions in JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-dom-props.md
                "react/forbid-dom-props": ["off", { forbid: [] }],

                // Validate props indentation in JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-elements.md
                "react/forbid-elements": ["off", { forbid: [] }],

                // Validate JSX has key prop when in array or iterator
                // but it's only critical if you're stripping propTypes in production.
                "react/forbid-foreign-prop-types": ["error", { allowInPropTypes: true }],

                // Limit maximum of props on a single line in JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
                "react/forbid-prop-types": [
                    "error",
                    {
                        checkChildContextTypes: true,
                        checkContextTypes: true,
                        forbid: ["any", "array", "object"],
                    },
                ],

                // Prevent usage of .bind() in JSX props
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
                "react/function-component-definition": [
                    "error",
                    {
                        namedComponents: "arrow-function",
                        unnamedComponents: "arrow-function",
                    },
                ],

                // Prevent duplicate props in JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
                "react/jsx-boolean-value": ["error", "never", { always: [] }],

                // Prevent usage of unwrapped JSX strings
                // Ensures inline tags are not rendered without spaces between them
                "react/jsx-child-element-spacing": "off",

                // Disallow undeclared variables in JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
                "react/jsx-closing-bracket-location": ["error", "line-aligned"],

                // Enforce PascalCase for user-defined JSX components
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
                "react/jsx-curly-brace-presence": ["error", { children: "never", props: "never" }],

                // Enforce propTypes declarations alphabetical sorting
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
                "react/jsx-curly-newline": [
                    "error",
                    {
                        multiline: "consistent",
                        singleline: "consistent",
                    },
                ],

                // Enforce props alphabetical sorting
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
                "react/jsx-curly-spacing": ["error", "never", { allowMultiline: true }],

                // Prevent React to be incorrectly marked as unused
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
                "react/jsx-equals-spacing": ["error", "never"],

                // Prevent variables used in JSX to be incorrectly marked as unused
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
                "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],

                // Prevent usage of dangerous JSX properties
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/bc976b837abeab1dffd90ac6168b746a83fc83cc/docs/rules/jsx-fragments.md
                "react/jsx-fragments": ["error", "syntax"],

                // Prevent usage of deprecated methods
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
                "react/jsx-handler-names": [
                    "off",
                    {
                        eventHandlerPrefix: "handle",
                        eventHandlerPropPrefix: "on",
                    },
                ],

                // Prevent usage of setState in componentWillUpdate
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
                "react/jsx-indent": ["error", indent, { checkAttributes: true, indentLogicalExpressions: true }],

                // Prevent direct mutation of this.state
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
                "react/jsx-indent-props": ["error", indent],

                // Prevent usage of isMounted
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-key.md
                "react/jsx-key": "off",

                // Prevent multiple component definition per file
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/abe8381c0d6748047224c430ce47f02e40160ed0/docs/rules/jsx-max-depth.md
                "react/jsx-max-depth": "off",

                // Prevent usage of setState
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
                "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],

                // Prevent using string references
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/e2eaadae316f9506d163812a09424eb42698470a/docs/rules/jsx-newline.md
                "react/jsx-newline": "off",

                // Prevent usage of unknown DOM property
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
                "react/jsx-no-bind": [
                    "error",
                    {
                        allowArrowFunctions: true,
                        allowBind: false,
                        allowFunctions: false,
                        ignoreDOMComponents: true,
                        ignoreRefs: true,
                    },
                ],

                // Require ES6 class declarations over React.createClass
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-comment-textnodes.md
                "react/jsx-no-comment-textnodes": "off",

                // Require stateless functions when not using lifecycle methods, setState or ref
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/e2eaadae316f9506d163812a09424eb42698470a/docs/rules/jsx-no-constructed-context-values.md
                "react/jsx-no-constructed-context-values": "error",

                // Prevent missing props validation in a React component definition
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
                "react/jsx-no-duplicate-props": "off",

                // Prevent missing React when using JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-literals.md
                "react/jsx-no-literals": ["off", { noStrings: true }],

                // Require render() methods to return something
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-script-url.md
                "react/jsx-no-script-url": [
                    "error",
                    [
                        {
                            name: "Link",
                            props: ["to"],
                        },
                    ],
                ],

                // Prevent extra closing tags for components without children
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/ac102885765be5ff37847a871f239c6703e1c7cc/docs/rules/jsx-no-target-blank.md
                "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],

                // Enforce defaultProps declarations alphabetical sorting
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
                "react/jsx-no-undef": "off",

                // Enforce component methods order
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
                "react/jsx-no-useless-fragment": "off",

                // Require that the first prop in a JSX element be on a new line when the element is multiline
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-one-expression-per-line.md
                "react/jsx-one-expression-per-line": ["error", { allow: "single-child" }],

                // Enforce spacing around jsx equals signs
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
                "react/jsx-pascal-case": [
                    "error",
                    {
                        allowAllCaps: true,
                        ignore: [],
                    },
                ],

                // Enforce JSX indentation
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/ac102885765be5ff37847a871f239c6703e1c7cc/docs/rules/jsx-props-no-multi-spaces.md
                "react/jsx-props-no-multi-spaces": "error",

                // Prevent usage of setState in componentDidMount
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
                "react/jsx-props-no-spreading": [
                    "error",
                    {
                        custom: "enforce",
                        exceptions: [],
                        explicitSpread: "ignore",
                        html: "enforce",
                    },
                ],

                // Prevent usage of setState in componentDidUpdate
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
                "react/jsx-sort-props": "off",

                // Disallow target="_blank" on links
                // Deprecated in favor of jsx-tag-spacing
                "react/jsx-space-before-closing": ["off", "always"],

                // prevent accidental JS comments from being injected into JSX as text
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md
                "react/jsx-tag-spacing": [
                    "error",
                    {
                        afterOpening: "never",
                        beforeClosing: "never",
                        beforeSelfClosing: "always",
                        closingSlash: "never",
                    },
                ],

                // disallow using React.render/ReactDOM.render's return value
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
                // DISABLED: Handled by react-x/jsx-uses-react
                "react/jsx-uses-react": "off",

                // require a shouldComponentUpdate method, or PureRenderMixin
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
                // DISABLED: Handled by react-x/jsx-uses-vars
                "react/jsx-uses-vars": "off",

                // warn against using findDOMNode()
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-access-state-in-setstate.md
                // DISABLED: Handled by react-x/no-access-state-in-setstate
                "react/no-access-state-in-setstate": "off",

                // Forbid certain props on Components
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-adjacent-inline-elements.md
                "react/no-adjacent-inline-elements": "error",

                // Forbid certain elements
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
                // DISABLED: Handled by react-x/no-array-index-key
                "react/no-array-index-key": "off",

                // Prevent problem with children and props.dangerouslySetInnerHTML
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
                // DISABLED: Handled by react-x/no-children-prop
                "react/no-children-prop": "off",

                // Prevent unused propType definitions
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-danger.md
                "react/no-danger": "error",

                // Require style prop value be an object or var
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
                "react/no-danger-with-children": "error",

                // Prevent invalid characters from appearing in markup
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
                "react/no-deprecated": ["error"],

                // Prevent passing of children as props
                // this is necessary for server-rendering
                "react/no-did-mount-set-state": "off",

                // Validate whitespace in and around the JSX opening and closing brackets
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
                "react/no-did-update-set-state": "error",

                // Enforce spaces before the closing bracket of self-closing JSX elements
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-space-before-closing.md
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
                // DISABLED: Handled by react-x/no-direct-mutation-state
                "react/no-direct-mutation-state": "off",

                // Prevent usage of Array index in keys
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
                "react/no-find-dom-node": "error",

                // Enforce a defaultProps definition for every prop that is not a required prop
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
                "react/no-is-mounted": "error",

                // Forbids using non-exported propTypes
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-foreign-prop-types.md
                // this is intentionally set to "error". it would be "error",
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
                "react/no-multi-comp": "off",

                // Prevent void DOM elements from receiving children
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/9e13ae2c51e44872b45cc15bf1ac3a72105bdd0e/docs/rules/no-redundant-should-component-update.md
                // DISABLED: Handled by react-x/no-redundant-should-component-update
                "react/no-redundant-should-component-update": "off",

                // Enforce all defaultProps have a corresponding non-required PropType
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
                "react/no-render-return-value": "error",

                // Prevent usage of shouldComponentUpdate when extending React.PureComponent
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-set-state.md
                "react/no-set-state": "off",

                // Prevent unused state values
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
                // DISABLED: Handled by react-x/no-string-refs
                "react/no-string-refs": "off",

                // Enforces consistent naming for boolean props
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-this-in-sfc.md
                "react/no-this-in-sfc": "error",

                // Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
                "react/no-unescaped-entities": "error",

                // One JSX Element Per Line
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
                "react/no-unknown-property": "error",

                // Enforce consistent usage of destructuring assignment of props, state, and context
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/157cc932be2cfaa56b3f5b45df6f6d4322a2f660/docs/rules/no-unsafe.md
                "react/no-unsafe": "off",

                // Prevent using this.state within a this.setState
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
                "react/no-unused-prop-types": [
                    "error",
                    {
                        customValidators: [],
                        skipShapeProps: true,
                    },
                ],

                // Prevent usage of button elements without an explicit type attribute
                // https://github.com/jsx-eslint/eslint-plugin-react/pull/1103/
                // DISABLED: Handled by react-x/no-unused-state
                "react/no-unused-state": "off",

                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-will-update-set-state.md
                "react/no-will-update-set-state": "error",

                // Prevent this from being used in stateless functional components
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
                "react/prefer-es6-class": ["error", "always"],

                // Validate JSX maximum depth
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-read-only-props.md
                "react/prefer-read-only-props": "off",

                // Disallow multiple spaces between inline JSX props
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
                "react/prefer-stateless-function": ["error", { ignorePureComponents: true }],

                // Prevent usage of UNSAFE_ methods
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
                "react/prop-types": "off",

                // Enforce shorthand or standard form for React fragments
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
                "react/react-in-jsx-scope": hasJsxRuntime ? "off" : "error",

                // Enforce a defaultProps definition for every prop that is not a required prop
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
                "react/require-default-props": "off",

                // Enforce state initialization style
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/state-in-constructor.md
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-optimization.md
                "react/require-optimization": ["off", { allowDecorators: [] }],

                // Enforces where React component static properties should be positioned
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/static-property-placement.md
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
                "react/require-render-return": "error",

                // Disallow JSX props spreading
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
                "react/self-closing-comp": "error",

                // Enforce that props are read-only
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
                "react/sort-comp": [
                    "error",
                    {
                        groups: {
                            lifecycle: [
                                "displayName",
                                "propTypes",
                                "contextTypes",
                                "childContextTypes",
                                "mixins",
                                "statics",
                                "defaultProps",
                                "constructor",
                                "getDefaultProps",
                                "getInitialState",
                                "state",
                                "getChildContext",
                                "getDerivedStateFromProps",
                                "componentWillMount",
                                "UNSAFE_componentWillMount",
                                "componentDidMount",
                                "componentWillReceiveProps",
                                "UNSAFE_componentWillReceiveProps",
                                "shouldComponentUpdate",
                                "componentWillUpdate",
                                "UNSAFE_componentWillUpdate",
                                "getSnapshotBeforeUpdate",
                                "componentDidUpdate",
                                "componentDidCatch",
                                "componentWillUnmount",
                            ],
                            rendering: ["/^render.+$/", "render"],
                        },
                        order: [
                            "static-variables",
                            "static-methods",
                            "instance-variables",
                            "lifecycle",
                            "/^handle.+$/",
                            "/^on.+$/",
                            "getters",
                            "setters",
                            "/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/",
                            "instance-methods",
                            "everything-else",
                            "rendering",
                        ],
                    },
                ],

                // Prevent usage of `javascript:` URLs
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-default-props.md
                "react/sort-default-props": [
                    "error",
                    {
                        ignoreCase: true,
                    },
                ],

                // Disallow unnecessary fragments
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-prop-types.md
                "react/sort-prop-types": [
                    "off",
                    {
                        callbacksLast: false,
                        ignoreCase: true,
                        requiredFirst: false,
                        sortShapeProp: true,
                    },
                ],

                // Prevent adjacent inline elements not separated by whitespace
                "react/state-in-constructor": ["error", "never"],

                // Enforce a specific function type for function components
                "react/static-property-placement": ["error", "static public field"],
                // Enforce a new line after jsx elements and expressions
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
                "react/style-prop-object": "error",

                // Prevent react contexts from taking non-stable values
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
                "react/void-dom-elements-no-children": "error",

                ...hasReactCompiler && pluginReactCompiler ? { "react-compiler/react-compiler": "error" } : {},

                ...pluginReactPerf?.configs?.flat?.recommended?.rules,

                "react-you-might-not-need-an-effect/you-might-not-need-an-effect": "warn",

                ...prettier
                    ? {
                        "react/jsx-child-element-spacing": "off",
                        "react/jsx-closing-bracket-location": "off",
                        "react/jsx-closing-tag-location": "off",
                        "react/jsx-curly-newline": "off",
                        "react/jsx-curly-spacing": "off",
                        "react/jsx-equals-spacing": "off",
                        "react/jsx-first-prop-new-line": "off",
                        "react/jsx-indent": "off",
                        "react/jsx-indent-props": "off",
                        "react/jsx-max-props-per-line": "off",
                        "react/jsx-newline": "off",
                        "react/jsx-one-expression-per-line": "off",
                        "react/jsx-props-no-multi-spaces": "off",
                        "react/jsx-tag-spacing": "off",
                        "react/jsx-wrap-multilines": "off",
                    }
                    : {},

                // overrides
                ...overrides,
            },
            // View link below for react rules documentation
            settings: {
                propWrapperFunctions: [
                    "forbidExtraProps", // https://www.npmjs.com/package/airbnb-prop-types
                    "exact", // https://www.npmjs.com/package/prop-types-exact
                    "Object.freeze", // https://tc39.github.io/ecma262/#sec-object.freeze
                ],
                react: {
                    // The default value is "detect". Automatic detection works by loading the entire React library
                    // into the linter's process, which is inefficient. It is recommended to specify the version
                    // explicity.
                    version: reactVersion ?? "detect",
                },
                "react-x": {
                    // The default value is "detect". Automatic detection works by loading the entire React library
                    // into the linter's process, which is inefficient. It is recommended to specify the version
                    // explicity.
                    version: reactVersion ?? "detect",
                },
            },
        },
        {
            files: ["**/*.jsx"],
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                    },
                },
            },
            name: "anolilab/react/jsx",
            rules: {
                // Enforces consistent use of the JSX file extension.
                // https://eslint-react.xyz/docs/rules/naming-convention-filename-extension
                "react-x/naming-convention/filename-extension": ["error", "as-needed"],

                // only .jsx files may have JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
                "react/jsx-closing-tag-location": "error",

                // Prevents common casing typos
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
                "react/jsx-filename-extension": "off",

                // Validate closing tag location in JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
                "react/jsx-wrap-multilines": [
                    "error",
                    {
                        arrow: "parens-new-line",
                        assignment: "parens-new-line",
                        condition: "parens-new-line",
                        declaration: "parens-new-line",
                        logical: "parens-new-line",
                        prop: "parens-new-line",
                        return: "parens-new-line",
                    },
                ],

                // Prevent missing parentheses around multilines JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/73abadb697034b5ccb514d79fb4689836fe61f91/docs/rules/no-typos.md
                "react/no-typos": "error",
            },
            settings: {
                extensions: [".jsx"],
            },
        },
        {
            files: ["**/*.tsx"],
            name: "anolilab/react/tsx",
            rules: {
                "react/default-props-match-prop-types": "off",
                // Disable JS specific rules
                "react/jsx-filename-extension": "off",
                "react/prop-types": "off",
                "react/require-default-props": "off",
            },
        },
        {
            // For performance run storybook/recommended on test files, not regular code
            files: getFilesGlobs("storybook"),
            name: "anolilab/react/storybook",
            rules: {
                "react/jsx-props-no-spreading": "off",
            },
        },
        ...isTypeAware
            ? [
                {
                    files: filesTypeAware,
                    ignores: ignoresTypeAware,
                    name: "anolilab/react/type-aware-rules",
                    rules: {
                        ...typeAwareRules,
                    },
                },
            ]
            : [],
    ];
});
