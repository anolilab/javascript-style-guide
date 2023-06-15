import { hasAnyDep, pkg } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";
import { env } from "node:process";

import { consoleLog } from "../../utils/loggers";
import bestPracticesConfig from "../best-practices";
import errorsConfig from "../errors";
// eslint-disable-next-line unicorn/prevent-abbreviations
import eS6Config from "../es6";
import styleConfig from "../style";
import variablesConfig from "../variables";
import importsConfig from "./import";

const bestPracticesRules = bestPracticesConfig.rules as Linter.RulesRecord;
const errorsRules = errorsConfig.rules as Linter.RulesRecord;
const styleRules = styleConfig.rules as Linter.RulesRecord;
// eslint-disable-next-line unicorn/prevent-abbreviations
const eS6Rules = eS6Config.rules as Linter.RulesRecord;
const importsRules = importsConfig.rules as Linter.RulesRecord;
const variablesRules = variablesConfig.rules as Linter.RulesRecord;

const { quotes, semi } = styleRules;
let { indent } = styleRules;

if (hasAnyDep(["prettier"])) {
    // Workaround VS Code trying to run this file twice!
    if (!global.hasAnolilabEsLintConfigTypescriptPrettier) {
        global.hasAnolilabEsLintConfigTypescriptPrettier = true;

        consoleLog(
            "\nFound prettier as dependency, disabling the '@typescript-eslint/indent' rule to fix wrong behavior of the rule; @see https://github.com/typescript-eslint/typescript-eslint/issues/1824",
        );
    }

    indent = "off";
}

const importExtensions = importsRules["import/extensions"] as any[];
const importNoExtraneousDependencies = importsRules["import/no-extraneous-dependencies"] as any[];
const commaDangle = styleRules["comma-dangle"] as any[];

let anolilabEslintConfig: { [key: string]: false | undefined } = {};

if (pkg) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    anolilabEslintConfig = pkg?.["anolilab"]?.["eslint-config"];
}

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.ts", "*.mts", "*.cts", "*.tsx"],
            extends: ["plugin:import/typescript"],
            plugins: ["@typescript-eslint"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
                warnOnUnsupportedTypeScriptVersion: anolilabEslintConfig?.["warn_on_unsupported_typescript_version"] ?? env["DISABLE_ESLINT_WARN_UNSUPPORTED_TYPESCRIPT_VERSION"] !== "true",
            },
            settings: {
                // Apply special parsing for TypeScript files
                "import/parsers": {
                    "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"],
                },

                // Append 'ts' extensions to 'import/resolver' setting
                "import/resolver": {
                    node: {
                        extensions: [".mjs", ".cjs", ".js", ".json", ".ts", ".d.ts"],
                    },
                },

                // Append 'ts' extensions to 'import/extensions' setting
                "import/extensions": [".js", ".mjs", ".jsx", ".ts", ".tsx", ".d.ts"],

                // Resolve type definition packages
                "import/external-module-folders": ["node_modules", "node_modules/@types"],
            },
            rules: {
                // Breaks @typescript-eslint/parser
                strict: "off",

                // Replace 'brace-style' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/brace-style.md
                "brace-style": "off",
                "@typescript-eslint/brace-style": styleRules["brace-style"],

                // Replace 'camelcase' rule with '@typescript-eslint/naming-convention'
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
                camelcase: "off",

                // eslint-disable-next-line max-len
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
                    // eslint-disable-next-line max-len
                    // recommends PascalCase for classes (23.3), and although it does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
                    {
                        selector: "typeLike",
                        format: ["PascalCase"],
                    },
                ],

                // Replace 'comma-dangle' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-dangle.md
                // The TypeScript version also adds 3 new options, all of which should be set to the same value as the base config
                "comma-dangle": "off",
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
                "comma-spacing": "off",
                "@typescript-eslint/comma-spacing": styleRules["comma-spacing"],

                // Disable the "dot-notation" rule, as it can report incorrect errors on TypeScript code
                "dot-notation": "off",

                // Replace 'func-call-spacing' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/func-call-spacing.md
                "func-call-spacing": "off",
                "@typescript-eslint/func-call-spacing": styleRules["func-call-spacing"],

                // Replace 'indent' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
                indent: "off",
                "@typescript-eslint/indent": indent,

                // Replace 'keyword-spacing' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/keyword-spacing.md
                "keyword-spacing": "off",
                "@typescript-eslint/keyword-spacing": styleRules["keyword-spacing"],

                // Replace 'lines-between-class-members' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/lines-between-class-members.md
                "lines-between-class-members": "off",
                "@typescript-eslint/lines-between-class-members": styleRules["lines-between-class-members"],

                // Replace 'no-array-constructor' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
                "no-array-constructor": "off",
                "@typescript-eslint/no-array-constructor": styleRules["no-array-constructor"],

                // Replace 'no-dupe-class-members' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dupe-class-members.md
                "no-dupe-class-members": "off",
                "@typescript-eslint/no-dupe-class-members": eS6Rules["no-dupe-class-members"],

                // Replace 'no-empty-function' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
                "no-empty-function": "off",
                "@typescript-eslint/no-empty-function": bestPracticesRules["no-empty-function"],

                // Replace 'no-extra-parens' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-parens.md
                "no-extra-parens": "off",
                "@typescript-eslint/no-extra-parens": errorsRules["no-extra-parens"],

                // Replace 'no-extra-semi' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-semi.md
                "no-extra-semi": "off",
                "@typescript-eslint/no-extra-semi": errorsRules["no-extra-semi"],

                // Disable the "no-implied-eval" and "no-new-func" rule, as it can report incorrect errors on TypeScript code
                "no-implied-eval": "off",
                "no-new-func": "off",

                // Replace 'no-loop-func' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.md
                "no-loop-func": "off",
                "@typescript-eslint/no-loop-func": bestPracticesRules["no-loop-func"],

                // Replace 'no-magic-numbers' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-magic-numbers.md
                "no-magic-numbers": "off",
                "@typescript-eslint/no-magic-numbers": bestPracticesRules["no-magic-numbers"],

                // Replace 'no-redeclare' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-redeclare.md
                "no-redeclare": "off",
                "@typescript-eslint/no-redeclare": bestPracticesRules["no-redeclare"],

                // Replace 'no-shadow' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
                "no-shadow": "off",
                "@typescript-eslint/no-shadow": variablesRules["no-shadow"],

                // Disable the "no-throw-literal" rule, as it can report incorrect errors on TypeScript code
                "no-throw-literal": "off",

                // Replace 'no-unused-expressions' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
                "no-unused-expressions": "off",
                "@typescript-eslint/no-unused-expressions": bestPracticesRules["no-unused-expressions"],

                // Replace 'no-unused-vars' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
                "no-unused-vars": "off",
                "@typescript-eslint/no-unused-vars": variablesRules["no-unused-vars"],

                // Replace 'no-use-before-define' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
                "no-use-before-define": "off",
                "@typescript-eslint/no-use-before-define": variablesRules["no-use-before-define"],

                // Replace 'no-useless-constructor' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
                "no-useless-constructor": "off",
                "@typescript-eslint/no-useless-constructor": eS6Rules["no-useless-constructor"],

                // Replace 'quotes' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/quotes.md
                quotes: "off",
                "@typescript-eslint/quotes": quotes,

                // Replace 'semi' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md
                semi: "off",
                "@typescript-eslint/semi": semi,

                // Replace 'space-before-function-paren' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-before-function-paren.md
                "space-before-function-paren": "off",
                "@typescript-eslint/space-before-function-paren": styleRules["space-before-function-paren"],

                // Replace 'no-return-await' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
                "no-return-await": "off",
                "@typescript-eslint/return-await": bestPracticesRules["no-return-await"],

                // Replace 'space-infix-ops' rule with '@typescript-eslint' version
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-infix-ops.md
                "space-infix-ops": "off",
                "@typescript-eslint/space-infix-ops": styleRules["space-infix-ops"],

                // Append 'ts' and 'tsx' to 'import/extensions' rule
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
                "import/extensions": [

                    importExtensions[0],
                    importExtensions[1],
                    {
                        ...importExtensions[2],
                        ts: "never",
                        tsx: "never",
                    },
                ],

                // Append 'ts' and 'tsx' extensions to 'import/no-extraneous-dependencies' rule
                // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
                "import/no-extraneous-dependencies": [

                    importNoExtraneousDependencies[0],
                    {
                        ...importNoExtraneousDependencies[1],
                        // eslint-disable-next-line max-len
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
                        devDependencies: importNoExtraneousDependencies[1].devDependencies.map((glob: string) => glob.replaceAll(/\bjs(x?)\b/g, "ts$1")),
                    },
                ],

                // The following rules are enabled in config, but are already checked (more thoroughly) by the TypeScript compiler
                // Some rules also fail in TypeScript files, for example: https://github.com/typescript-eslint/typescript-eslint/issues/662#issuecomment-507081586
                "constructor-super": "off",
                "getter-return": "off",
                "no-const-assign": "off",
                "no-dupe-args": "off",
                "no-dupe-keys": "off",
                "no-func-assign": "off",
                "no-new-symbol": "off",
                "no-obj-calls": "off",
                "no-this-before-super": "off",
                "no-undef": "off",
                "no-unreachable": "off",
                "no-unsafe-negation": "off",
                "valid-typeof": "off",
                "import/named": "off",
                "import/no-unresolved": "off",
                "react/require-default-props": "off",

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
            },
        },
        {
            files: ["*.d.ts"],
            rules: {
                "import/no-duplicates": "off",
            },
        },
    ],
};

export default config;
