import type { Config } from "prettier";

const config: Config = {
    // brackets are required for arrow function parameter, even when there is only one parameter
    arrowParens: "always",
    // spaces are required at the beginning and end of the braces
    bracketSpacing: true,
    // formats quoted code embedded
    embeddedLanguageFormatting: "auto",
    // lf for newline
    endOfLine: "lf",
    // decide whether to break the html according to the display style
    htmlWhitespaceSensitivity: "css",
    // No need to automatically insert @prettier at the beginning of the file
    insertPragma: false,
    // use double quotes instead of single quotes in jsx
    jsxSingleQuote: false,
    overrides: [
        { files: ".eslintrc", options: { parser: "json" } },
        { files: ".prettierrc", options: { parser: "json" } },
        { files: ".stylelintrc", options: { parser: "json" } },
        { files: "package*.json", options: { printWidth: 1000 } },
        { files: "*.yml", options: { singleQuote: false } },
        { files: "*.yaml", options: { singleQuote: false } },
    ],
    // max 160 characters per line
    printWidth: 160,
    // use default break criteria
    proseWrap: "preserve",
    // object's key is quoted only when necessary
    quoteProps: "as-needed",
    rangeEnd: Number.POSITIVE_INFINITY,
    // format the entire contents of the file
    rangeStart: 0,
    // no need to write the beginning @prettier of the file
    requirePragma: false,
    // semicolon at the end of the line
    semi: true,
    // use single quotes
    singleQuote: false,
    // use 4 spaces for indentation
    tabWidth: 4,
    // all comma at the end
    trailingComma: "all",
    // use spaces instead of indentations
    useTabs: false,
    // vue files script and style tags indentation
    vueIndentScriptAndStyle: false,
};

export default config;
