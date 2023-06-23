import type { Linter } from "eslint";

type FileType = "all" | "ava" | "javascript" | "jest" | "js_and_ts" | "jsx_and_tsx" | "tests" | "typescript" | "vitest";

const getType = (type: FileType) => {
    switch (type) {
        case "typescript": {
            // @see https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#new-file-extensions
            return ["*.ts", "*.tsx", "*.mts", "*.cts"];
        }
        case "jsx_and_tsx": {
            return ["*.jsx", "*.tsx"];
        }
        case "js_and_ts": {
            return ["*.js", "*.mjs", "*.cjs", "*.ts", "*.mts", "*.cts"];
        }
        case "all": {
            return ["*.js", "*.jsx", "*.mjs", "*.cjs", "*.ts", "*.tsx", "*.mts", "*.cts"];
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
        default: {
            throw new Error(`Unknown type: ${type}`);
        }
    }
};

export const createConfig = (
    type: FileType,
    config: Omit<Linter.ConfigOverride<Linter.RulesRecord>, "files">,
    environment?: { [name: string]: boolean },
): Linter.Config => {
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
        config: Omit<Linter.ConfigOverride<Linter.RulesRecord>, "files">;
        type: FileType;
    }[],
): Linter.Config => {
    return {
        overrides: rules.map(({ type, config }) => {
            return {
                files: getType(type),
                ...config,
            };
        }),
    };
};
