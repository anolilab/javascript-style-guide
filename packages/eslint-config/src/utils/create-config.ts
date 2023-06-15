import type { Linter } from "eslint";

const createConfig = (type: "all" | "javascript" | "js_and_ts" | "jsx" | "typescript", config: Omit<Linter.Config, "files|overrides">): Linter.Config => {
    let files = [
"*.js",
"*.mjs",
"*.cjs",
];

    // eslint-disable-next-line default-case
    switch (type) {
        case "typescript": {
            files = ["*.ts", "*.tsx"];

            break;
        }
        case "jsx": {
            files = ["*.jsx", "*.tsx"];

            break;
        }
        case "js_and_ts": {
            files = [
"*.js",
"*.mjs",
"*.cjs",
"*.ts",
];

            break;
        }
        case "all": {
            files = [
"*.js",
"*.jsx",
"*.mjs",
"*.cjs",
"*.ts",
"*.tsx",
];

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
