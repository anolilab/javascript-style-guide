import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { Linter } from "eslint";

import type {
    OptionsComponentExtensions,
    OptionsFiles,
    OptionsHasPrettier,
    OptionsIsInEditor,
    OptionsOverrides,
    OptionsTypeScriptParserOptions,
    OptionsTypeScriptWithTypes,
    TypedFlatConfigItem,
} from "../../types";
import { createConfig, getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import { bestPracticesRules } from "../best-practices";
import { es6Rules as es6RulesFunction } from "../es6";
import { styleRules as styleRulesFunction } from "../style";
import { variablesRules } from "../variables";

export default createConfig<
    OptionsComponentExtensions
    & OptionsFiles
    & OptionsHasPrettier
    & OptionsIsInEditor
    & OptionsOverrides
    & OptionsTypeScriptParserOptions
    & OptionsTypeScriptWithTypes
>("ts", async (config, oFiles) => {
    const {
        componentExts: componentExtensions = [],
        files = oFiles,
        isInEditor = false,
        overrides,
        overridesTypeAware,
        parserOptions,
        prettier,
    } = config;

    const styleRules = styleRulesFunction;
    const es6Rules = es6RulesFunction(isInEditor);

    const [tseslint, noForOfArrayPlugin] = await Promise.all([
        interopDefault(import("typescript-eslint")),
        interopDefault(import("eslint-plugin-no-for-of-array")),
    ] as const);

    let erasableSyntaxOnlyPlugin;

    if (parserOptions?.erasableSyntaxOnly) {
        erasableSyntaxOnlyPlugin = await interopDefault(
            import("eslint-plugin-erasable-syntax-only"),
        );
    }

    const filesTypeAware = config.filesTypeAware ?? getFilesGlobs("ts");
    const ignoresTypeAware = [
        ...getFilesGlobs("astro"),
        ...getFilesGlobs("markdown"),
        ...getFilesGlobs("markdown_inline_js_jsx"),
        ...getFilesGlobs("js"),
        ...getFilesGlobs("jsx"),
        "**/*.json",
        "**/*.jsonc",
        ...config.ignoresTypeAware ?? [],
    ];
    const { tsconfigPath } = config;

    let { isTypeAware = true } = config;

    isTypeAware = isTypeAware && tsconfigPath !== undefined;

    const makeParser = (
        typeAware: boolean,
        pFiles: string[],
        ignores?: string[],
    ): TypedFlatConfigItem => {
        const thisDirectory = dirname(fileURLToPath(import.meta.url));

        return {
            files: [
                ...pFiles,
                ...componentExtensions.map((extension) => `**/*.${extension}`),
            ],
            ...ignores ? { ignores } : {},
            languageOptions: {
                parser: tseslint.parser,

                parserOptions: {
                    extraFileExtensions: componentExtensions.map(
                        (extension) => `.${extension}`,
                    ),
                    sourceType: "module",
                    ...typeAware
                        ? {
                            projectService: true,
                            tsconfigRootDir: thisDirectory,
                        }
                        : {},
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...(parserOptions as any),
                },
            },
            name: `anolilab/typescript/${typeAware ? "type-aware-parser" : "parser"}`,
        };
    };

    const rules: TypedFlatConfigItem[] = [
        {
            // Install the plugins without globs, so they can be configured separately.
            name: "anolilab/typescript/setup",
            plugins: {
                "@typescript-eslint": tseslint.plugin,
                "no-for-of-array": noForOfArrayPlugin,
                ...erasableSyntaxOnlyPlugin
                    ? erasableSyntaxOnlyPlugin.configs.recommended.plugins
                    : {},
            },
        },
        // assign type-aware parser for type-aware files and type-unaware parser for the rest
        ...isTypeAware
            ? [
                makeParser(false, files),
                makeParser(true, filesTypeAware, ignoresTypeAware),
            ]
            : [makeParser(false, files)],
        ...(tseslint.configs.strict as TypedFlatConfigItem[]),
    ];

    if (isTypeAware) {
        rules.push(
            ...(tseslint.configs
                .strictTypeCheckedOnly as TypedFlatConfigItem[]),
            {
                files: [
                    ...filesTypeAware,
                    ...componentExtensions.map(
                        (extension) => `**/*.${extension}`,
                    ),
                ],
                name: "anolilab/typescript/rules-type-aware",
                rules: {
                    // Disallow type assertions that do not change the type of expression.
                    // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-type-assertion.mdx
                    "@typescript-eslint/no-unnecessary-type-assertion": "error",

                    // Disallow calling a function with a value with type any.
                    // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-argument.mdx
                    "@typescript-eslint/no-unsafe-argument": "error",

                    // Disallow assigning a value with type any to variables and properties.
                    // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-assignment.mdx
                    "@typescript-eslint/no-unsafe-assignment": "error",

                    // Disallow calling a value with type any.
                    // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-call.mdx
                    "@typescript-eslint/no-unsafe-call": "error",

                    // Disallow member access on a value with type any.
                    // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-member-access.mdx
                    "@typescript-eslint/no-unsafe-member-access": "error",

                    // Disallow returning a value with type any from a function.
                    // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-return.mdx
                    "@typescript-eslint/no-unsafe-return": "error",

                    // Enforce using the nullish coalescing operator instead of logical chaining.
                    // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-nullish-coalescing.mdx
                    "@typescript-eslint/prefer-nullish-coalescing": "error",

                    // Enforce using concise optional chain expressions instead of chained logical ands, negated logical ors, or empty objects.
                    // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-optional-chain.mdx
                    "@typescript-eslint/prefer-optional-chain": "error",

                    ...overridesTypeAware,
                },
            },
            {
                files: getFilesGlobs("all"),
                name: "anolilab/typescript/no-for-of-array/rules",
                rules: {
                    "no-for-of-array/no-for-of-array": "error",
                },
            },
        );
    }

    rules.push({
        files,
        name: "anolilab/typescript/rules",
        rules: {
            // Require that function overload signatures be consecutive.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/adjacent-overload-signatures.mdx
            "@typescript-eslint/adjacent-overload-signatures": "error",

            // Requires using either T[] for arrays (array-type)
            "@typescript-eslint/array-type": [
                "error",
                {
                    default: "array",
                    readonly: "generic",
                },
            ],

            "@typescript-eslint/ban-ts-comment": [
                "error",
                {
                    minimumDescriptionLength: 3,
                    "ts-check": false,
                    "ts-expect-error": "allow-with-description",
                    "ts-ignore": "allow-with-description",
                    "ts-nocheck": true,
                },
            ],

            // @TODO: Fix this rule
            // Some built-in types have aliases, while some types are considered dangerous or harmful.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/ban-types.mdx
            // Enforces that types will not to be used
            // "@typescript-eslint/ban-types": [
            //     "error",
            //     {
            //         types: {
            //             String: { message: "Use string instead", fixWith: "string" },
            //             Boolean: { message: "Use boolean instead", fixWith: "boolean" },
            //             Number: { message: "Use number instead", fixWith: "number" },
            //             Object: { message: "Use object instead", fixWith: "object" },
            //             Array: { message: "Provide a more specific type" },
            //         },
            //     },
            // ],

            // Enforce specifying generic type arguments on constructor name of a constructor call.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/consistent-generic-constructors.mdx
            "@typescript-eslint/consistent-generic-constructors": "error",

            // Enforce consistent usage of type imports.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/consistent-type-imports.mdx
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    disallowTypeAnnotations: false,
                    fixStyle: "separate-type-imports",
                    prefer: "type-imports",
                },
            ],

            // Require explicit accessibility modifiers on class properties and methods.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/explicit-member-accessibility.mdx
            "@typescript-eslint/explicit-member-accessibility": "error",

            // Require explicit return and argument types on exported functions' and classes' public class methods.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.mdx
            "@typescript-eslint/explicit-module-boundary-types": "error",

            // Enforce a standard member declaration order. (member-ordering from TSLint)
            "@typescript-eslint/member-ordering": [
                "error",
                {
                    default: [
                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",
                        "public-static-method",
                        "protected-static-method",
                        "private-static-method",
                        "public-instance-field",
                        "protected-instance-field",
                        "private-instance-field",
                        "constructor",
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method",
                    ],
                },
            ],

            // Enforce using a particular method signature syntax.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/method-signature-style.mdx
            "@typescript-eslint/method-signature-style": "error",

            // The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and `trailingUnderscore` settings.
            // However, the existing `no-underscore-dangle` rule already takes care of this.
            "@typescript-eslint/naming-convention": [
                "error",
                // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
                {
                    format: ["camelCase", "PascalCase", "UPPER_CASE"],
                    selector: "variable",
                },
                // Allow camelCase functions (23.2), and PascalCase functions (23.8)
                {
                    format: ["camelCase", "PascalCase"],
                    selector: "function",
                },
                // recommends PascalCase for classes (23.3), and although it does not make TypeScript recommendations,
                // we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
                {
                    format: ["PascalCase"],
                    selector: "typeLike",
                },
            ],

            // Replace 'no-array-constructor' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.mdx
            "@typescript-eslint/no-array-constructor": styleRules[
                "no-array-constructor"
            ] as Linter.RuleEntry<[]>,

            // Disallow non-null assertion in locations that may be confusing.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-confusing-non-null-assertion.mdx
            "@typescript-eslint/no-confusing-non-null-assertion": "error",

            // Replace 'no-dupe-class-members' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dupe-class-members.mdx
            "@typescript-eslint/no-dupe-class-members": es6Rules[
                "no-dupe-class-members"
            ] as Linter.RuleEntry<[]>,

            // Disallow duplicate enum member values.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-duplicate-enum-values.mdx
            "@typescript-eslint/no-duplicate-enum-values": "error",

            // Disallow using to delete operator on computed key expressions.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-dynamic-delete.mdx
            "@typescript-eslint/no-dynamic-delete": "warn",

            // Replace 'no-empty-function' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.mdx
            "@typescript-eslint/no-empty-function": bestPracticesRules[
                "no-empty-function"
            ] as Linter.RuleEntry<[]>,

            "@typescript-eslint/no-explicit-any": ["error", {
                fixToUnknown: false,

                // No other way to type a function that takes any number of arguments
                // This should be used in generics where we're narrowing the type with any
                ignoreRestArgs: true,
            }],

            // Disallow extra non-null assertions.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-extra-non-null-assertion.mdx
            "@typescript-eslint/no-extra-non-null-assertion": "error",

            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-import-type-side-effects.mdx
            "@typescript-eslint/no-import-type-side-effects": "error",

            // Disallow void type outside of generic or return types.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-invalid-void-type.mdx
            "@typescript-eslint/no-invalid-void-type": "warn",

            // Replace 'no-loop-func' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.mdx
            "@typescript-eslint/no-loop-func": bestPracticesRules[
                "no-loop-func"
            ] as Linter.RuleEntry<[]>,

            // Replace 'no-magic-numbers' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-magic-numbers.mdx
            "@typescript-eslint/no-magic-numbers": bestPracticesRules[
                "no-magic-numbers"
            ] as Linter.RuleEntry<[]>,

            // Enforce valid definition of new and constructor.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-misused-new.mdx
            "@typescript-eslint/no-misused-new": "error",

            // Disallow TypeScript namespaces.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-namespace.mdx
            "@typescript-eslint/no-namespace": "error",

            // Disallow non-null assertions in the left operand of a nullish coalescing operator.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-non-null-asserted-nullish-coalescing.mdx
            "@typescript-eslint/no-non-null-asserted-nullish-coalescing":
                "warn",

            // Disallow non-null assertions after an optional chain expression.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-non-null-asserted-optional-chain.mdx
            "@typescript-eslint/no-non-null-asserted-optional-chain": "error",

            // Disallow non-null assertions using the ! postfix operator.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-non-null-assertion.mdx
            "@typescript-eslint/no-non-null-assertion": "error",

            // Replace 'no-redeclare' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-redeclare.mdx
            "@typescript-eslint/no-redeclare": bestPracticesRules[
                "no-redeclare"
            ] as Linter.RuleEntry<[]>,

            // Disallow invocation of require().
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-require-imports.mdx
            "@typescript-eslint/no-require-imports": "error",

            // Replace 'no-shadow' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.mdx
            "@typescript-eslint/no-shadow": variablesRules[
                "no-shadow"
            ] as Linter.RuleEntry<[]>,

            // Disallow aliasing this.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-this-alias.mdx
            "@typescript-eslint/no-this-alias": "error",

            // Disallow unnecessary constraints on generic types.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-type-constraint.mdx
            "@typescript-eslint/no-unnecessary-type-constraint": "error",

            // Disallow unsafe declaration merging.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-declaration-merging.mdx
            "@typescript-eslint/no-unsafe-declaration-merging": "error",

            // Replace 'no-unused-expressions' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.mdx
            "@typescript-eslint/no-unused-expressions": bestPracticesRules[
                "no-unused-expressions"
            ] as Linter.RuleEntry<[]>,

            // Replace 'no-unused-vars' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.mdx
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "after-used",
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    ignoreRestSiblings: true,

                    /**
                     * TypeScript ignores any variables that are prefixed with _
                     * https://github.com/microsoft/TypeScript/pull/9464
                     */
                    vars: "all",
                    varsIgnorePattern: "^_",
                },
            ],

            // Replace 'no-use-before-define' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.mdx
            "@typescript-eslint/no-use-before-define": variablesRules[
                "no-use-before-define"
            ] as Linter.RuleEntry<[]>,

            // Replace 'no-useless-constructor' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.mdx
            "@typescript-eslint/no-useless-constructor": es6Rules[
                "no-useless-constructor"
            ] as Linter.RuleEntry<[]>,

            // Disallow empty exports that don't change anything in a module file.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-useless-empty-export.mdx
            "@typescript-eslint/no-useless-empty-export": "error",

            // Enforce non-null assertions over explicit type casts. This rule is disabled by @typescript-eslint/no-non-null-assertion.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/non-nullable-type-assertion-style.mdx
            "@typescript-eslint/non-nullable-type-assertion-style": "off",

            // Require each enum member value to be explicitly initialized.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-enum-initializers.mdx
            "@typescript-eslint/prefer-enum-initializers": "error",

            // Enforce using function types instead of interfaces with call signatures.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-function-type.mdx
            "@typescript-eslint/prefer-function-type": "error",
            // Disabled to use faster alternatives.
            "@typescript-eslint/prefer-string-starts-ends-with": "off",

            // Enforce using @ts-expect-error over @ts-ignore.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-ts-expect-error.mdx
            // DEPRECATED: in favor of ban-ts-comment
            "@typescript-eslint/prefer-ts-expect-error": "off",

            // Replace 'no-return-await' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.mdx
            "@typescript-eslint/return-await": bestPracticesRules[
                "no-return-await"
            ] as Linter.RuleEntry<[]>,

            // Replaced by stylistic rules
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.mdx
            "@typescript-eslint/semi": "off",

            // Enforce constituents of a type union/intersection to be sorted alphabetically.
            // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/sort-type-constituents.mdx
            // Disabled to avoid conflicts with perfectionist/sort-intersection-types
            "@typescript-eslint/sort-type-constituents": "off",

            // Replaced by stylistic rules
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-before-function-paren.mdx
            "@typescript-eslint/space-before-function-paren": "off",

            // Replace 'space-infix-ops' rule with '@typescript-eslint' version
            // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-infix-ops.mdx
            "@typescript-eslint/space-infix-ops": styleRules[
                "space-infix-ops"
            ] as Linter.RuleEntry<[]>,

            ...erasableSyntaxOnlyPlugin
                ? erasableSyntaxOnlyPlugin.configs.recommended.rules
                : {},

            ...overrides,

            // Disable rules that are handled by prettier
            ...prettier
                ? {
                    "@typescript-eslint/block-spacing": "off",
                    "@typescript-eslint/brace-style": "off",
                    "@typescript-eslint/comma-dangle": "off",
                    "@typescript-eslint/comma-spacing": "off",
                    "@typescript-eslint/func-call-spacing": "off",
                    "@typescript-eslint/indent": "off",
                    "@typescript-eslint/key-spacing": "off",
                    "@typescript-eslint/keyword-spacing": "off",
                    "@typescript-eslint/lines-around-comment": 0,
                    "@typescript-eslint/member-delimiter-style": "off",
                    "@typescript-eslint/no-extra-parens": "off",
                    "@typescript-eslint/no-extra-semi": "off",
                    "@typescript-eslint/object-curly-spacing": "off",
                    "@typescript-eslint/quotes": 0,
                    "@typescript-eslint/semi": "off",
                    "@typescript-eslint/space-before-blocks": "off",
                    "@typescript-eslint/space-before-function-paren": "off",
                    "@typescript-eslint/space-infix-ops": "off",
                    "@typescript-eslint/type-annotation-spacing": "off",
                }
                : {},
        },
    });

    return rules;
});
