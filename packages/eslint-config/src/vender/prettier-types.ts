/**
 * Vendor types from Prettier so we don't rely on the dependency.
 */

export type BuiltInParserName =
    | "acorn"
    | "angular"
    | "babel-flow"
    | "babel-ts"
    | "babel"
    | "css"
    | "espree"
    | "flow"
    | "glimmer"
    | "graphql"
    | "html"
    | "json-stringify"
    | "json"
    | "json5"
    | "less"
    | "lwc"
    | "markdown"
    | "mdx"
    | "meriyah"
    | "scss"
    | "typescript"
    | "vue"
    | "xml"
    | "yaml";

export type ExternalParserName = "astro" | "slidev";

// This utility is here to handle the case where you have an explicit union
// between string literals and the generic string type. It would normally
// resolve out to just the string type, but this generic LiteralUnion maintains
// the intellisense of the original union.
//
// It comes from this issue: microsoft/TypeScript#29729:
//   https://github.com/microsoft/TypeScript/issues/29729#issuecomment-700527227
export type LiteralUnion<T extends U, U = string> = T | (Pick<U, never> & { _?: never | undefined });

export type VendoredPrettierOptions = Partial<VendoredPrettierOptionsRequired>;

export interface VendoredPrettierOptionsRequired {
    /**
     * Include parentheses around a sole arrow function parameter.
     * @default "always"
     */
    arrowParens: "always" | "avoid";
    /**
     * Put the `>` of a multi-line HTML (HTML, XML, JSX, Vue, Angular) element at the end of the last line instead of being
     * alone on the next line (does not apply to self closing elements).
     */
    bracketSameLine: boolean;
    /**
     * Print spaces between brackets in object literals.
     */
    bracketSpacing: boolean;
    /**
     * Which end of line characters to apply.
     * @default "lf"
     */
    endOfLine: "auto" | "cr" | "crlf" | "lf";
    /**
     * How to handle whitespaces in HTML.
     * @default "css"
     */
    htmlWhitespaceSensitivity: "css" | "ignore" | "strict";
    /**
     * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
     * @deprecated use bracketSameLine instead
     */
    jsxBracketSameLine: boolean;
    /**
     * Use single quotes in JSX.
     */
    jsxSingleQuote: boolean;
    /**
     * Provide ability to support new languages to prettier.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: (any | string)[];
    /**
     * Specify the line length that the printer will wrap on.
     * @default 120
     */
    printWidth: number;
    /**
     * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
     * In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
     * @default "preserve"
     */
    proseWrap: "always" | "never" | "preserve";
    /**
     * Change when properties in objects are quoted.
     * @default "as-needed"
     */
    quoteProps: "as-needed" | "consistent" | "preserve";
    /**
     * Format only a segment of a file.
     * @default Number.POSITIVE_INFINITY
     */
    rangeEnd: number;
    /**
     * Format only a segment of a file.
     */
    rangeStart: number;
    /**
     * Print semicolons at the ends of statements.
     */
    semi: boolean;
    /**
     * Enforce single attribute per line in HTML, XML, Vue and JSX.
     * @default false
     */
    singleAttributePerLine: boolean;
    /**
     * Use single quotes instead of double quotes.
     */
    singleQuote: boolean;
    /**
     * Specify the number of spaces per indentation-level.
     */
    tabWidth: number;
    /**
     * Print trailing commas wherever possible.
     */
    trailingComma: "all" | "es5" | "none";
    /**
     * Indent lines with tabs instead of spaces
     */
    useTabs?: boolean;
    /**
     * Whether or not to indent the code inside <script> and <style> tags in Vue files.
     * @default false
     */
    vueIndentScriptAndStyle: boolean;

    /**
     * How to handle whitespaces in XML.
     * @default "preserve"
     */
    xmlQuoteAttributes: "double" | "preserve" | "single";
    /**
     * Whether to put a space inside the brackets of self-closing XML elements.
     * @default true
     */
    xmlSelfClosingSpace: boolean;
    /**
     * Whether to sort attributes by key in XML elements.
     * @default false
     */
    xmlSortAttributesByKey: boolean;
    /**
     * How to handle whitespaces in XML.
     * @default "ignore"
     */
    xmlWhitespaceSensitivity: "ignore" | "preserve" | "strict";
}

export type VendoredPrettierRuleOptions = VendoredPrettierOptions & {
    [k: string]: unknown | undefined;
    parser?: BuiltInParserName | ExternalParserName;
};
