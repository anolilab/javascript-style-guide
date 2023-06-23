// eslint-disable-next-line unicorn/better-regex
const automaticCommitPattern = /^chore\(release\):.*\[skip ci\]/;

const config = {
    extends: ["@commitlint/config-conventional"],
    /**
     * This resolves a linting conflict between commitlint's body-max-line-length
     * due to @semantic-release/git putting release notes in the commit body
     * https://github.com/semantic-release/git/issues/331
     */
    ignores: [(commitMessage: string): boolean => automaticCommitPattern.test(commitMessage)],
    rules: {
        "body-leading-blank": [1, "always"],
        "body-max-line-length": [2, "always", 100],
        "footer-leading-blank": [1, "always"],
        "footer-max-line-length": [2, "always", 100],
        "header-max-length": [2, "always", 100],
        "scope-case": [2, "always", "lower-case"],
        "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
        "subject-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],
        "type-enum": [
            2,
            "always",
            [
                "build",
                "chore",
                "ci",
                "deps",
                "docs",
                "feat",
                "fix",
                "perf",
                "refactor",
                "revert",
                "security",
                "style",
                "test",
                "translation",
            ],
        ],
    },
};

export default config;
