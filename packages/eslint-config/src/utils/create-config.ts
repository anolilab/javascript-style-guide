import type { Linter } from "eslint";
import type { OptionsFiles, OptionsHasTypeScript, OptionsIsInEditor, OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from "../types";

type FileType =
    | "all"
    | "d.ts"
    | "javascript"
    | "js_and_ts"
    | "jsx_and_tsx"
    | "markdown_inline_js_jsx"
    | "markdown"
    | "postcss"
    | "yaml"
    | "toml"
    | "storybook"
    | "typescript"
    | "vitest";

export const getFilesGlobs = (fileType: FileType): string[] => {
    switch (fileType) {
        case "typescript": {
            // @see https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#new-file-extensions
            return ["**/*.ts", "**/*.d.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];
        }
        case "jsx_and_tsx": {
            return ["**/*.jsx", "**/*.tsx"];
        }
        case "js_and_ts": {
            return ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.ts", "**/*.d.ts", "**/*.mts", "**/*.cts"];
        }
        case "javascript": {
            return ["**/*.js", "**/*.mjs", "**/*.cjs"];
        }
        case "all": {
            return ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs", "**/*.ts", "**/*.d.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];
        }
        case "markdown": {
            return ["**/*.{md,mkdn,mdown,markdown}"];
        }
        case "markdown_inline_js_jsx": {
            return ["**/*.{md,mkdn,mdown,markdown}/*.{js,javascript,jsx,node,json}"];
        }
        case "vitest": {
            return ["**/__tests__/**/*.?(c|m)[jt]s?(x)", "**/?(*.){test,spec}.?(c|m)[jt]s?(x)"];
        }
        case "d.ts": {
            return ["**/*.d.ts"];
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
        case "toml": {
            return ["**/*.toml"];
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
export const createConfigs = (
    rules: {
        config: Omit<Linter.ConfigOverride, "files">;
        type: FileType;
    }[],
): Linter.Config => {
    return {
        overrides: rules.map(({ config, type }) => {
            return {
                files: getFilesGlobs(type),
                ...config,
            };
        }),
    };
};
