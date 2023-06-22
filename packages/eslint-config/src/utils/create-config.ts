import type { Linter } from "eslint";

const createConfig = (
    type: "all" | "javascript" | "js_and_ts" | "jsx_and_tsx" | "typescript",
    config: Omit<Linter.Config, "files|overrides">,
): Linter.Config => {
    let files = ["*.js", "*.mjs", "*.cjs"];

    // eslint-disable-next-line default-case
    switch (type) {
        case "typescript": {
            // @see https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#new-file-extensions
            files = ["*.ts", "*.tsx", "*.mts", "*.cts"];

            break;
        }
        case "jsx_and_tsx": {
            files = ["*.jsx", "*.tsx"];

            break;
        }
        case "js_and_ts": {
            files = ["*.js", "*.mjs", "*.cjs", "*.ts", "*.mts", "*.cts"];

            break;
        }
        case "all": {
            files = ["*.js", "*.jsx", "*.mjs", "*.cjs", "*.ts", "*.tsx", "*.mts", "*.cts"];

            break;
        }
        // No default
    }

    return {
        overrides: [
            {
                files,
                ...config,
            },
        ],
    };
};

export default createConfig;
