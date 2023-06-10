import type { Options } from "prettier";

const config: Options = {
    // max 164 characters per line
    printWidth: 164,
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
};

export default config;
