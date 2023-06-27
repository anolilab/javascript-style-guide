import type { Config } from "lint-staged";

const extensions = ["json", "json5", "jsonc", "cjs", "js", "mjs", "cts", "ts", "mts", "yml", "yaml", "jsx", "tsx", "md", "mdx"] as const;

const group: Config = {
    [`*.{${extensions.join(",")}}`]: ["cross-env NO_LOGS=true eslint"],
};

export default group;
