/**
 * Shared oxfmt (Oxc formatter) configuration for Anolilab.
 *
 * The option set mirrors `@anolilab/prettier-config` wherever oxfmt supports the same key,
 * so a project formatted by oxfmt matches one formatted by Prettier under the Anolilab style.
 * @see https://oxc.rs/docs/guide/usage/formatter/config
 */

/**
 * The subset of oxfmt options this config sets. oxfmt is Prettier-compatible, so the keys
 * match Prettier's where they overlap.
 */
interface OxfmtConfig {
    arrowParens?: "always" | "avoid";
    bracketSameLine?: boolean;
    bracketSpacing?: boolean;
    embeddedLanguageFormatting?: "auto" | "off";
    endOfLine?: "cr" | "crlf" | "lf";
    htmlWhitespaceSensitivity?: "css" | "ignore" | "strict";
    insertFinalNewline?: boolean;
    jsxSingleQuote?: boolean;
    objectWrap?: "collapse" | "preserve";
    overrides?: { excludeFiles?: string[]; files: string[]; options: Omit<OxfmtConfig, "overrides"> }[];
    printWidth?: number;
    proseWrap?: "always" | "never" | "preserve";
    quoteProps?: "as-needed" | "consistent" | "preserve";
    semi?: boolean;
    singleAttributePerLine?: boolean;
    singleQuote?: boolean;
    tabWidth?: number;
    trailingComma?: "all" | "es5" | "none";
    useTabs?: boolean;
    vueIndentScriptAndStyle?: boolean;
}

const config: OxfmtConfig = {
    // Brackets are required for arrow function parameters, even with a single parameter.
    arrowParens: "always",
    // Spaces at the beginning and end of the braces.
    bracketSpacing: true,
    // Format quoted code embedded in the file.
    embeddedLanguageFormatting: "auto",
    // lf for newlines.
    endOfLine: "lf",
    // Break the html according to the display style.
    htmlWhitespaceSensitivity: "css",
    // Always end files with a single newline.
    insertFinalNewline: true,
    // Use double quotes instead of single quotes in jsx.
    jsxSingleQuote: false,
    overrides: [
        { files: ["package.json", "package-lock.json"], options: { printWidth: 1000 } },
        { files: ["*.yml", "*.yaml"], options: { singleQuote: false } },
    ],
    // Max 160 characters per line (oxfmt defaults to 100).
    printWidth: 160,
    // Use default break criteria for prose.
    proseWrap: "preserve",
    // Quote object keys only when necessary.
    quoteProps: "as-needed",
    // Semicolon at the end of the line.
    semi: true,
    // Use double quotes.
    singleQuote: false,
    // Use 4 spaces for indentation.
    tabWidth: 4,
    // Trailing comma everywhere.
    trailingComma: "all",
    // Use spaces instead of tabs.
    useTabs: false,
    // Do not indent script and style tags in Vue files.
    vueIndentScriptAndStyle: false,
};

export type { OxfmtConfig };

export default config;
