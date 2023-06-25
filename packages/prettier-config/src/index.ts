import type { Config } from "prettier";

const config: Config = {
    // max 160 characters per line
    printWidth: 160,
    // use 4 spaces for indentation
    tabWidth: 4,
    // use spaces instead of indentations
    useTabs: false,
    // semicolon at the end of the line
    semi: true,
    // use single quotes
    singleQuote: false,
    // object's key is quoted only when necessary
    quoteProps: "as-needed",
    // use double quotes instead of single quotes in jsx
    jsxSingleQuote: false,
    // all comma at the end
    trailingComma: "all",
    // spaces are required at the beginning and end of the braces
    bracketSpacing: true,
    // brackets are required for arrow function parameter, even when there is only one parameter
    arrowParens: "always",
    // format the entire contents of the file
    rangeStart: 0,
    rangeEnd: Number.POSITIVE_INFINITY,
    // no need to write the beginning @prettier of the file
    requirePragma: false,
    // No need to automatically insert @prettier at the beginning of the file
    insertPragma: false,
    // use default break criteria
    proseWrap: "preserve",
    // decide whether to break the html according to the display style
    htmlWhitespaceSensitivity: "css",
    // vue files script and style tags indentation
    vueIndentScriptAndStyle: false,
    // lf for newline
    endOfLine: "lf",
    // formats quoted code embedded
    embeddedLanguageFormatting: "auto",
    overrides: [
        { files: ".eslintrc", options: { parser: "json" } },
        { files: ".prettierrc", options: { parser: "json" } },
        { files: ".stylelintrc", options: { parser: "json" } },
        { files: "package*.json", options: { printWidth: 1000 } },
        { files: "*.yml", options: { singleQuote: false } },
        { files: "*.yaml", options: { singleQuote: false } },
    ],
};

export default config;
