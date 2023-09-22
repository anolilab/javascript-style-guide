import { env } from "node:process";

import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import { createConfigs } from "../../utils/create-config";
import anolilabEslintConfig from "../../utils/eslint-config";
import bestPracticesConfig from "../best-practices";
import errorsConfig from "../errors";
// eslint-disable-next-line unicorn/prevent-abbreviations
import eS6Config from "../es6";
import styleConfig from "../style";
import variablesConfig from "../variables";

// @ts-expect-error TODO: find the correct type
const bestPracticesRules = bestPracticesConfig.overrides[0].rules as Linter.RulesRecord;
// @ts-expect-error TODO: find the correct type
const errorsRules = errorsConfig.overrides[0].rules as Linter.RulesRecord;
// @ts-expect-error TODO: find the correct type
const styleRules = styleConfig.overrides[0].rules as Linter.RulesRecord;
// @ts-expect-error TODO: find the correct type
// eslint-disable-next-line unicorn/prevent-abbreviations
const eS6Rules = eS6Config.overrides[0].rules as Linter.RulesRecord;
// @ts-expect-error TODO: find the correct type
const variablesRules = variablesConfig.overrides[0].rules as Linter.RulesRecord;

const { indent, quotes, semi } = styleRules;

if (global.anolilabEslintConfigTypescriptPrettierRules === undefined && (hasDependency("prettier") || hasDevDependency("prettier"))) {
    global.anolilabEslintConfigTypescriptPrettierRules = {
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
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commaDangle = styleRules["comma-dangle"] as any[];

let showUnsupportedTypeScriptVersionWarning: boolean = env["DISABLE_ESLINT_WARN_UNSUPPORTED_TYPESCRIPT_VERSION"] !== "true";

if (anolilabEslintConfig["warn_on_unsupported_typescript_version"] !== undefined) {
    showUnsupportedTypeScriptVersionWarning = anolilabEslintConfig["warn_on_unsupported_typescript_version"];
}

const config: Linter.Config = createConfigs([
    {
        config: {
            extends: ["plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/stylistic", "plugin:@typescript-eslint/strict"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                sourceType: "module",
                warnOnUnsupportedTypeScriptVersion: showUnsupportedTypeScriptVersionWarning,
            },
            plugins: ["@typescript-eslint"],
            rules: {
                // Replace 'brace-style' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/brace-style.md
                "@typescript-eslint/brace-style": styleRules["brace-style"],

                // The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and `trailingUnderscore` settings. However, the existing `no-underscore-dangle` rule already takes care of this.
                "@typescript-eslint/naming-convention": [
                    "error",
                    // Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
                    {
                        selector: "variable",
                        format: ["camelCase", "PascalCase", "UPPER_CASE"],
                    },
                    // Allow camelCase functions (23.2), and PascalCase functions (23.8)
                    {
                        selector: "function",
                        format: ["camelCase", "PascalCase"],
                    },
                    // recommends PascalCase for classes (23.3), and although it does not make TypeScript recommendations,
                    // we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
                    {
                        selector: "typeLike",
                        format: ["PascalCase"],
                    },
                ],

                // Replace 'comma-dangle' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-dangle.md
                // The TypeScript version also adds 3 new options, all of which should be set to the same value as the base config
                "@typescript-eslint/comma-dangle": [
                    commaDangle[0],
                    {
                        ...commaDangle[1],
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                        enums: commaDangle[1].arrays,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                        generics: commaDangle[1].arrays,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                        tuples: commaDangle[1].arrays,
                    },
                ],

                // Replace 'comma-spacing' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-spacing.md
                "@typescript-eslint/comma-spacing": styleRules["comma-spacing"],

                // Replace 'func-call-spacing' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/func-call-spacing.md
                "@typescript-eslint/func-call-spacing": styleRules["func-call-spacing"],

                // Replace 'indent' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
                "@typescript-eslint/indent": indent,

                // Replace 'keyword-spacing' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/keyword-spacing.md
                "@typescript-eslint/keyword-spacing": styleRules["keyword-spacing"],

                // Replace 'lines-between-class-members' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/lines-between-class-members.md
                "@typescript-eslint/lines-between-class-members": ["error", "always", { exceptAfterSingleLine: false }],

                // Replace 'no-array-constructor' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
                "@typescript-eslint/no-array-constructor": styleRules["no-array-constructor"],

                // Replace 'no-dupe-class-members' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dupe-class-members.md
                "@typescript-eslint/no-dupe-class-members": eS6Rules["no-dupe-class-members"],

                // Replace 'no-empty-function' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
                "@typescript-eslint/no-empty-function": bestPracticesRules["no-empty-function"],

                // Replace 'no-extra-parens' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-parens.md
                "@typescript-eslint/no-extra-parens": errorsRules["no-extra-parens"],

                // Replace 'no-extra-semi' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-semi.md
                "@typescript-eslint/no-extra-semi": errorsRules["no-extra-semi"],

                // Replace 'no-loop-func' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.md
                "@typescript-eslint/no-loop-func": bestPracticesRules["no-loop-func"],

                // Replace 'no-magic-numbers' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-magic-numbers.md
                "@typescript-eslint/no-magic-numbers": bestPracticesRules["no-magic-numbers"],

                // Replace 'no-redeclare' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-redeclare.md
                "@typescript-eslint/no-redeclare": bestPracticesRules["no-redeclare"],

                // Replace 'no-shadow' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
                "@typescript-eslint/no-shadow": variablesRules["no-shadow"],

                // Replace 'no-unused-expressions' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
                "@typescript-eslint/no-unused-expressions": bestPracticesRules["no-unused-expressions"],

                // Replace 'no-unused-vars' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
                "@typescript-eslint/no-unused-vars": variablesRules["no-unused-vars"],

                // Replace 'no-use-before-define' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
                "@typescript-eslint/no-use-before-define": variablesRules["no-use-before-define"],

                // Replace 'no-useless-constructor' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
                "@typescript-eslint/no-useless-constructor": eS6Rules["no-useless-constructor"],

                // Replace 'quotes' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/quotes.md
                "@typescript-eslint/quotes": quotes,

                // Replace 'semi' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md
                "@typescript-eslint/semi": semi,

                // Replace 'space-before-function-paren' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-before-function-paren.md
                "@typescript-eslint/space-before-function-paren": styleRules["space-before-function-paren"],

                // Replace 'no-return-await' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
                "@typescript-eslint/return-await": bestPracticesRules["no-return-await"],

                // Replace 'space-infix-ops' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-infix-ops.md
                "@typescript-eslint/space-infix-ops": styleRules["space-infix-ops"],

                // Enforce consistent usage of type imports.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/consistent-type-imports.md
                "@typescript-eslint/consistent-type-imports": "error",

                // Require that function overload signatures be consecutive.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/adjacent-overload-signatures.md
                "@typescript-eslint/adjacent-overload-signatures": "error",

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

                // Requires using either T[] for arrays (array-type)
                "@typescript-eslint/array-type": [
                    "error",
                    {
                        default: "array",
                        readonly: "generic",
                    },
                ],

                // Some built-in types have aliases, while some types are considered dangerous or harmful.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/ban-types.md
                // Enforces that types will not to be used
                "@typescript-eslint/ban-types": [
                    "error",
                    {
                        types: {
                            String: { message: "Use string instead", fixWith: "string" },
                            Boolean: { message: "Use boolean instead", fixWith: "boolean" },
                            Number: { message: "Use number instead", fixWith: "number" },
                            Object: { message: "Use object instead", fixWith: "object" },
                            Array: { message: "Provide a more specific type" },
                            // Ban the type-unsafe built-in utility types because they're vulnerable to typos and to failing silently after a rename refactoring.
                            // See https://www.typescriptlang.org/docs/handbook/utility-types.html
                            // See https://github.com/pelotom/type-zoo#omitstrictt-k-extends-keyof-t
                            // See https://github.com/krzkaczor/ts-essentials#Comparison-between-Omit-and-StrictOmit
                            // TODO make this a real rule instead of using `ban-types`: https://github.com/danielnixon/eslint-plugin-total-functions/issues/88
                            Omit: {
                                fixWith: "OmitStrict",
                                message: "Omit is not type-safe. Prefer a strict version such as OmitStrict from the type-zoo package.",
                            },
                            Exclude: {
                                fixWith: "ExcludeStrict",
                                message: "Exclude is not type-safe. Prefer a strict version such as ExcludeStrict from the type-zoo package.",
                            },
                            Extract: {
                                fixWith: "ExtractStrict",
                                message: "Extract is not type-safe. Prefer a strict version such as ExtractStrict from the type-zoo package.",
                            },
                        },
                    },
                ],

                // Enforce constituents of a type union/intersection to be sorted alphabetically.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/sort-type-constituents.md
                "@typescript-eslint/sort-type-constituents": "error",

                // Enforce using @ts-expect-error over @ts-ignore.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-ts-expect-error.md
                "@typescript-eslint/prefer-ts-expect-error": "error",

                // Enforce specifying generic type arguments on constructor name of a constructor call.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/consistent-generic-constructors.md
                "@typescript-eslint/consistent-generic-constructors": "error",

                // Require explicit accessibility modifiers on class properties and methods.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md
                "@typescript-eslint/explicit-member-accessibility": "error",

                // Require explicit return and argument types on exported functions' and classes' public class methods.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md
                "@typescript-eslint/explicit-module-boundary-types": "error",

                // Enforce using a particular method signature syntax.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/method-signature-style.md
                "@typescript-eslint/method-signature-style": "error",

                // Disallow non-null assertion in locations that may be confusing.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-confusing-non-null-assertion.md
                "@typescript-eslint/no-confusing-non-null-assertion": "error",

                // Disallow duplicate enum member values.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-duplicate-enum-values.md
                "@typescript-eslint/no-duplicate-enum-values": "error",

                // Disallow using to delete operator on computed key expressions.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-dynamic-delete.md
                "@typescript-eslint/no-dynamic-delete": "warn",

                // Disallow extra non-null assertions.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-extra-non-null-assertion.md
                "@typescript-eslint/no-extra-non-null-assertion": "error",

                // Disallow void type outside of generic or return types.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-invalid-void-type.md
                "@typescript-eslint/no-invalid-void-type": "warn",

                // Enforce valid definition of new and constructor.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-misused-new.md
                "@typescript-eslint/no-misused-new": "error",

                // Disallow TypeScript namespaces.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-namespace.md
                "@typescript-eslint/no-namespace": "error",

                // Disallow non-null assertions in the left operand of a nullish coalescing operator.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-non-null-asserted-nullish-coalescing.md
                "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "warn",

                // Disallow non-null assertions after an optional chain expression.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-non-null-asserted-optional-chain.md
                "@typescript-eslint/no-non-null-asserted-optional-chain": "error",

                // Disallow non-null assertions using the ! postfix operator.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
                "@typescript-eslint/no-non-null-assertion": "error",

                // Disallow invocation of require().
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-require-imports.md
                "@typescript-eslint/no-require-imports": "error",

                // Disallow aliasing this.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-this-alias.md
                "@typescript-eslint/no-this-alias": "error",

                // Disallow type assertions that do not change the type of expression.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-type-assertion.md
                "@typescript-eslint/no-unnecessary-type-assertion": "error",

                // Disallow unnecessary constraints on generic types.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-type-constraint.md
                "@typescript-eslint/no-unnecessary-type-constraint": "error",

                // Disallow calling a function with a value with type any.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-argument.md
                "@typescript-eslint/no-unsafe-argument": "error",

                // Disallow assigning a value with type any to variables and properties.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-assignment.md
                "@typescript-eslint/no-unsafe-assignment": "error",

                // Disallow calling a value with type any.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-call.md
                "@typescript-eslint/no-unsafe-call": "error",

                // Disallow unsafe declaration merging.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-declaration-merging.md
                "@typescript-eslint/no-unsafe-declaration-merging": "error",

                // Disallow member access on a value with type any.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-member-access.md
                "@typescript-eslint/no-unsafe-member-access": "error",

                // Disallow returning a value with type any from a function.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unsafe-return.md
                "@typescript-eslint/no-unsafe-return": "error",

                // Disallow empty exports that don't change anything in a module file.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-useless-empty-export.md
                "@typescript-eslint/no-useless-empty-export": "error",

                // Enforce non-null assertions over explicit type casts. This rule is disabled by @typescript-eslint/no-non-null-assertion.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/non-nullable-type-assertion-style.md
                "@typescript-eslint/non-nullable-type-assertion-style": "off",

                // Require each enum member value to be explicitly initialized.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-enum-initializers.md
                "@typescript-eslint/prefer-enum-initializers": "error",

                // Enforce using function types instead of interfaces with call signatures.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-function-type.md
                "@typescript-eslint/prefer-function-type": "error",

                // Enforce using the nullish coalescing operator instead of logical chaining.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-nullish-coalescing.md
                "@typescript-eslint/prefer-nullish-coalescing": "error",

                // Enforce using concise optional chain expressions instead of chained logical ands, negated logical ors, or empty objects.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-optional-chain.md
                "@typescript-eslint/prefer-optional-chain": "error",

                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-import-type-side-effects.md
                "@typescript-eslint/no-import-type-side-effects": "error",

                // Disable rules that are handled by prettier
                ...global.anolilabEslintConfigTypescriptPrettierRules,
            },
        },
        type: "typescript",
    },
]);

export default config;
