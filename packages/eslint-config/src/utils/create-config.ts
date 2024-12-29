import type { TypedFlatConfigItem } from "../types";

type FileType =
    | "all"
    | "astro"
    | "d.ts"
    | "js"
    | "ts"
    | "js_and_ts"
    | "jsx_and_tsx"
    | "markdown_inline_js_jsx"
    | "markdown_in_markdown"
    | "markdown"
    | "postcss"
    | "yaml"
    | "toml"
    | "storybook"
    | "e2e"
    | "html"
    | "vitest";

// @see https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#new-file-extensions
const dtsGlobal = ["**/*.d.ts", "**/*.d.cts", "**/*.d.mts"];
const tsGlobal = ["**/*.ts", "**/*.cts", "**/*.mts"];
const tsxGlobal = ["**/*.tsx", "**/*.mtsx", "**/*.ctsx"];

const jsGlobal = ["**/*.js", "**/*.mjs", "**/*.cjs"];
const jsxGlobal = ["**/*.jsx", "**/*.mjsx", "**/*.cjsx"];

export const getFilesGlobs = (fileType: FileType): string[] => {
    switch (fileType) {
        case "jsx_and_tsx": {
            return [...jsxGlobal, ...tsxGlobal];
        }
        case "astro": {
            return ["'**/*.astro/*.ts"];
        }
        case "ts": {
            return [...tsGlobal, ...dtsGlobal, ...tsxGlobal];
        }
        case "js": {
            return jsGlobal;
        }
        case "js_and_ts": {
            return [...jsGlobal, ...tsGlobal];
        }
        case "all": {
            return [...jsGlobal, ...dtsGlobal, ...tsGlobal, ...tsxGlobal, ...jsxGlobal];
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
        case "vitest": {
            return ["**/__tests__/**/*.?(c|m)[jt]s?(x)", "**/?(*.){test,spec}.?(c|m)[jt]s?(x)"];
        }
        case "d.ts": {
            return dtsGlobal;
        }
        case "storybook": {
            return ["**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)", "**/*.story.@(ts|tsx|js|jsx|mjs|cjs)"];
        }
        case "postcss": {
            return ["**/postcss.config.js", "**/postcssrc.js", "**/postcss.config.cjs", "**/postcssrc.cjs"];
        }
        case "yaml": {
            return ["**/*.yaml", "**/*.yml"];
        }
        case "e2e": {
            return ["**/e2e/**/*.test.{js,ts,jsx,tsx}"];
        }
        case "toml": {
            return ["**/*.toml"];
        }
        case "html": {
            return ["**/*.erb", "**/*.handlebars", "**/*.hbs", "**/*.htm", "**/*.html", "**/*.mustache", "**/*.nunjucks", "**/*.php", "**/*.tag", "**/*.twig", "**/*.we"];
        }
        default: {
            throw new Error("Unknown type");
        }
    }
};

export const createConfig =
    <O>(type: FileType, rules: (options: O, files: string[]) => Promise<Omit<TypedFlatConfigItem, "files">[]>) =>
    async (options: O): Promise<TypedFlatConfigItem[]> =>
        await rules(options, getFilesGlobs(type));
