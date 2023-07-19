import type { Linter } from "eslint";

type FileType =
    | "all"
    | "ava"
    | "d.ts"
    | "javascript"
    | "jest"
    | "js_and_ts"
    | "jsx_and_tsx"
    | "markdown_inline_js_jsx"
    | "markdown"
    | "mdx"
    | "tests"
    | "typescript"
    | "vitest";

const getType = (fileType: FileType) => {
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
        case "mdx": {
            return ["**/*.mdx"];
        }
        case "jest": {
            return [
                // Test files
                "**/*.spec.{js,ts,tsx}",
                "**/*.test.{js,ts,tsx}",
                "**/test/*.{js,ts,tsx}",

                // Facebook convention
                "**/__mocks__/*.{js,ts,tsx}",
                "**/__tests__/*.{js,ts,tsx}",
            ];
        }
        case "ava": {
            return [
                "test.js",
                "src/test.js",
                "source/test.js",
                "**/test-*.js",
                "**/*.spec.js",
                "**/*.test.js",
                "**/test/**/*.js",
                "**/tests/**/*.js",
                "**/__tests__/**/*.js",
            ];
        }
        case "vitest": {
            return ["**/__tests__/**/*.?(c|m)[jt]s?(x)", "**/?(*.){test,spec}.?(c|m)[jt]s?(x)"];
        }
        case "tests": {
            return [
                // ava
                "test.js",
                "src/test.js",
                "source/test.js",
                "**/test-*.js",
                "**/*.spec.js",
                "**/*.test.js",
                "**/test/**/*.js",
                "**/tests/**/*.js",
                "**/__tests__/**/*.js",

                // jest
                "**/*.spec.{js,ts,tsx}",
                "**/*.test.{js,ts,tsx}",
                "**/test/*.{js,ts,tsx}",
                "**/__mocks__/*.{js,ts,tsx}",
                "**/__tests__/*.{js,ts,tsx}",
                "**/__tests__/**/*.?(c|m)[jt]s?(x)",
                "**/?(*.){test,spec}.?(c|m)[jt]s?(x)",
            ];
        }
        case "d.ts": {
            return ["**/*.d.ts"];
        }
        default: {
            throw new Error("Unknown type");
        }
    }
};

export const createConfig = (type: FileType, config: Omit<Linter.ConfigOverride, "files">, environment?: Record<string, boolean>): Linter.Config => {
    return {
        env: environment,
        overrides: [
            {
                files: getType(type),
                ...config,
            },
        ],
    };
};
export const createConfigs = (
    rules: {
        config: Omit<Linter.ConfigOverride, "files">;
        type: FileType;
    }[],
): Linter.Config => {
    return {
        overrides: rules.map(({ config, type }) => {
            return {
                files: getType(type),
                ...config,
            };
        }),
    };
};
