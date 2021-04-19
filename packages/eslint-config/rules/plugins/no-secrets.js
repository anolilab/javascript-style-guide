// @see https://github.com/nickdeis/eslint-plugin-no-secrets
const noSecrets = {
    overrides: [
        {
            plugins: ["no-secrets"],
            rules: {
                "no-secrets/no-secrets": "error",
            },
            files: ["*", "*/**"],
            excludedFiles: [
                "package.json",
                "**/package.json",
                "package-lock.json",
                "**/package-lock.json",
                "tsconfig.json",
                "**/tsconfig.json",
            ],
        },
    ],
};

export default noSecrets
