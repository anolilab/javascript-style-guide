import { createConfig } from "./packages/eslint-config/dist/index.js";

export default createConfig(
    {
        zod: true,
        unocss: false,
        ignores: [
            ".github/**",
            "eslint.config.js",
            "labeler-config.yml",
            "pnpm-workspace.yaml",
            "scripts/**",
            // Every package's local eslint config ignores its own __tests__; mirror that here so the
            // root config (used by lint-staged) does not flag the `__tests__` directory naming.
            "**/__tests__/**",
            // Tool config for @visulima/vis. Remove this entry once the package is installed
            // and its types resolve, otherwise the defineConfig() call reads as an unsafe call.
            "vis.config.ts",
            "packages/eslint-config/__fixtures__/**",
            "packages/eslint-config/README.md",
            // Doc code blocks show import/export examples that the markdown JS linter cannot parse
            // as project-service files; the packages' local configs ignore these too.
            "packages/oxfmt-config/README.md",
            "packages/oxlint-config/README.md",
            "packages/eslint-config/scripts/**",
            "packages/eslint-config/src/vender/**",
        ],
    },
    {
        files: ["packages/eslint-config/**/*.ts"],
        rules: {
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "no-secrets/no-secrets": "off",
        },
    },
    {
        files: ["packages/eslint-config/eslint.config.js", "**/.prettierrc.*"],
        rules: {
            "antfu/no-import-dist": "off",
        },
    },
    {
        files: ["**/e18e.ts"],
        rules: {
            // Renamed from `unicorn/prevent-abbreviations` in eslint-plugin-unicorn v72.
            "unicorn/name-replacements": "off",
        },
    },
    {
        files: ["**/no-unsupported-browser-features.ts"],
        rules: {
            "sonarjs/file-name-differ-from-class": "off",
        },
    },
);
