import { hasPackageJsonAnyDependency } from "@visulima/package";
import { readTsConfig } from "@visulima/tsconfig";
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

// @see https://github.com/jsx-eslint/eslint-plugin-react
export default createConfig<
    OptionsFiles &
    OptionsHasPrettier &
    OptionsOverrides &
    OptionsPackageJson &
    OptionsSilentConsoleLogs &
    OptionsStylistic &
    OptionsTypeScriptParserOptions &
    OptionsTypeScriptWithTypes
    // eslint-disable-next-line sonarjs/cognitive-complexity
>("jsx_and_tsx", async (config, oFiles) => {
    const {
        files = oFiles,
        filesTypeAware = getFilesGlobs("ts"),
        ignoresTypeAware = [`**/*.md/**`, ...getFilesGlobs("astro")],
        overrides,
        packageJson,
        prettier,
        silent,
        stylistic = true,
        tsconfigPath,
    } = config;

    const isTypeAware = tsconfigPath !== undefined;

    const { indent = 4 } = typeof stylistic === "boolean" ? {} : stylistic;

    const typeAwareRules: TypedFlatConfigItem["rules"] = {
        "react/no-leaked-conditional-rendering": "warn",
    };

    const [pluginReactX, pluginReact, pluginReactHooks, pluginReactRefresh] = await Promise.all([
        interopDefault(import("@eslint-react/eslint-plugin")),
        interopDefault(import("eslint-plugin-react")),
        interopDefault(import("eslint-plugin-react-hooks")),
        interopDefault(import("eslint-plugin-react-refresh")),
    ] as const);

    const isAllowConstantExport = hasPackageJsonAnyDependency(packageJson, ReactRefreshAllowConstantExportPackages);
    const isUsingRemix = hasPackageJsonAnyDependency(packageJson, RemixPackages);
    const isUsingNext = hasPackageJsonAnyDependency(packageJson, NextJsPackages);
    const isUsingReactRouter = hasPackageJsonAnyDependency(packageJson, ReactRouterPackages);

    const plugins = pluginReactX.configs.all.plugins;

    let reactVersion = packageJson?.["dependencies"]?.["react"] || packageJson?.["devDependencies"]?.["react"];

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

    return [
        {
            name: "anolilab/react/setup",
            plugins: {
                react: pluginReact,
                "react-dom": plugins["@eslint-react/dom"],
                "react-hooks": pluginReactHooks,
                "react-hooks-extra": plugins["@eslint-react/hooks-extra"],
                "react-naming-convention": plugins["@eslint-react/naming-convention"],
                "react-refresh": pluginReactRefresh,
                "react-x": plugins["@eslint-react"],
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

                // Enforce Rules of Hooks
                // https://github.com/facebook/react/blob/1204c789776cb01fbaf3e9f032e7e2ba85a44137/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js
                "react-hooks/exhaustive-deps": "error",

                // Verify the list of the dependencies for Hooks like useEffect and similar
                // https://github.com/facebook/react/blob/c11015ff4f610ac2924d1fc6d569a17657a404fd/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js
                "react-hooks/rules-of-hooks": "error",

                // react refresh
                "react-refresh/only-export-components": [
                    "warn",
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
                "react/forbid-foreign-prop-types": ["warn", { allowInPropTypes: true }],

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
                "react/jsx-no-comment-textnodes": "error",

                // Require stateless functions when not using lifecycle methods, setState or ref
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/e2eaadae316f9506d163812a09424eb42698470a/docs/rules/jsx-no-constructed-context-values.md
                "react/jsx-no-constructed-context-values": "error",

                // Prevent missing props validation in a React component definition
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
                "react/jsx-no-duplicate-props": ["error", { ignoreCase: true }],

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
                "react/jsx-no-undef": "error",

                // Enforce component methods order
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
                "react/jsx-no-useless-fragment": "error",

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
                "react/jsx-uses-react": [hasJsxRuntime ? "off" : "error"],

                // require a shouldComponentUpdate method, or PureRenderMixin
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
                "react/jsx-uses-vars": "error",

                // warn against using findDOMNode()
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-access-state-in-setstate.md
                "react/no-access-state-in-setstate": "error",

                // Forbid certain props on Components
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-adjacent-inline-elements.md
                "react/no-adjacent-inline-elements": "error",

                // Forbid certain elements
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
                "react/no-array-index-key": "error",

                // Prevent problem with children and props.dangerouslySetInnerHTML
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
                "react/no-children-prop": "error",

                // Prevent unused propType definitions
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-danger.md
                "react/no-danger": "warn",

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
                "react/no-direct-mutation-state": "error",

                // Prevent usage of Array index in keys
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
                "react/no-find-dom-node": "error",

                // Enforce a defaultProps definition for every prop that is not a required prop
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
                "react/no-is-mounted": "error",

                // Forbids using non-exported propTypes
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-foreign-prop-types.md
                // this is intentionally set to "warn". it would be "error",
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
                "react/no-multi-comp": "off",

                // Prevent void DOM elements from receiving children
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/9e13ae2c51e44872b45cc15bf1ac3a72105bdd0e/docs/rules/no-redundant-should-component-update.md
                "react/no-redundant-should-component-update": "error",

                // Enforce all defaultProps have a corresponding non-required PropType
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
                "react/no-render-return-value": "error",

                // Prevent usage of shouldComponentUpdate when extending React.PureComponent
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-set-state.md
                "react/no-set-state": "off",

                // Prevent unused state values
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
                "react/no-string-refs": "error",

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
                "react/no-unused-state": "error",

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
                "react/prop-types": [
                    "error",
                    {
                        customValidators: [],
                        ignore: [],
                        skipUndeclared: false,
                    },
                ],

                // Enforce shorthand or standard form for React fragments
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
                "react/react-in-jsx-scope": hasJsxRuntime ? "off" : "error",

                // Enforce a defaultProps definition for every prop that is not a required prop
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
                "react/require-default-props": [
                    "error",
                    {
                        forbidDefaultForRequired: true,
                        functions: hasPackageJsonAnyDependency(packageJson, ["typescript"]) ? "defaultArguments" : "defaultProps",
                    },
                ],

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
                // only .jsx files may have JSX
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
                "react/jsx-closing-tag-location": "error",

                // Prevents common casing typos
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
                "react/jsx-filename-extension": "error",

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
