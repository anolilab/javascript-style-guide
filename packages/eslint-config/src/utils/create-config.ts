import type { TypedFlatConfigItem } from "../types";

type FileType =
    | "all"
    | "astro_ts"
    | "astro"
    | "css"
    | "d.ts"
    | "e2e"
    | "graphql"
    | "html"
    | "js_and_ts"
    | "js"
    | "jsx_and_tsx"
    | "less"
    | "markdown_in_markdown"
    | "markdown_inline_js_jsx"
    | "markdown"
    | "postcss"
    | "scss"
    | "storybook"
    | "svg"
    | "toml"
    | "ts"
    | "vitest"
    | "xml"
    | "yaml";

// @see https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#new-file-extensions
const dtsGlobal = ["**/*.d.ts", "**/*.d.cts", "**/*.d.mts"];
const tsGlobal = ["**/*.ts", "**/*.cts", "**/*.mts"];
const tsxGlobal = ["**/*.tsx", "**/*.mtsx", "**/*.ctsx"];

const jsGlobal = ["**/*.js", "**/*.mjs", "**/*.cjs"];
const jsxGlobal = ["**/*.jsx", "**/*.mjsx", "**/*.cjsx"];

export const getFilesGlobs = (fileType: FileType): string[] => {
    switch (fileType) {
        case "all": {
            return [...jsGlobal, ...dtsGlobal, ...tsGlobal, ...tsxGlobal, ...jsxGlobal];
        }
        case "astro": {
            return ["**/*.astro"];
        }
        case "astro_ts": {
            return ["**/*.astro/*.ts"];
        }
        case "css": {
            return ["**/*.css"];
        }
        case "d.ts": {
            return dtsGlobal;
        }
        case "e2e": {
            return ["**/e2e/**/*.test.{js,ts,jsx,tsx}"];
        }
        case "graphql": {
            return ["**/*.{g,graph}ql"];
        }
        case "html": {
            return [
                "**/*.erb",
                "**/*.handlebars",
                "**/*.hbs",
                "**/*.htm",
                "**/*.html",
                "**/*.mustache",
                "**/*.nunjucks",
                "**/*.php",
                "**/*.tag",
                "**/*.twig",
                "**/*.we",
            ];
        }
        case "js": {
            return jsGlobal;
        }
        case "js_and_ts": {
            return [...jsGlobal, ...tsGlobal];
        }
        case "jsx_and_tsx": {
            return [...jsxGlobal, ...tsxGlobal];
        }
        case "less": {
            return ["**/*.less"];
        }
        case "markdown": {
            return ["**/*.{md,mkdn,mdown,markdown}"];
        }
        case "markdown_in_markdown": {
            return ["**/*.{md,mkdn,mdown,markdown}/*.{md,mkdn,mdown,markdown}"];
        }
        case "markdown_inline_js_jsx": {
            return ["**/*.{md,mkdn,mdown,markdown}/*.{js,javascript,jsx,node,json}"];
        }
        case "postcss": {
            return ["**/postcss.config.js", "**/postcssrc.js", "**/postcss.config.cjs", "**/postcssrc.cjs"];
        }
        case "scss": {
            return ["**/*.scss"];
        }
        case "storybook": {
            return ["**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)", "**/*.story.@(ts|tsx|js|jsx|mjs|cjs)"];
        }
        case "svg": {
            return ["**/*.svg"];
        }
        case "toml": {
            return ["**/*.toml"];
        }
        case "ts": {
            return [...tsGlobal, ...dtsGlobal, ...tsxGlobal];
        }
        case "vitest": {
            return ["**/__tests__/**/*.?(c|m)[jt]s?(x)", "**/?(*.){test,spec}.?(c|m)[jt]s?(x)"];
        }
        case "xml": {
            return ["**/*.xml"];
        }
        case "yaml": {
            return ["**/*.yaml", "**/*.yml"];
        }
        default: {
            throw new Error("Unknown type");
        }
    }
};

export const createConfig = <O>(type: FileType, rules: (options: O, files: string[]) => Promise<Omit<TypedFlatConfigItem, "files">[]>) => async (options: O): Promise<TypedFlatConfigItem[]> => await rules(options, getFilesGlobs(type));
