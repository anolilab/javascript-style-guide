import type { OptionsOverrides, TypedFlatConfigItem } from "../../types";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/nickdeis/eslint-plugin-no-secrets
const noSecrets = async (config: OptionsOverrides): Promise<TypedFlatConfigItem[]> => {
    const noSecretsPlugin = await interopDefault(import("eslint-plugin-no-secrets"));

    return [
        {
            files: ["*", "*/**"],
            ignores: ["package.json", "**/package.json", "package-lock.json", "**/package-lock.json", "tsconfig.json", "**/tsconfig.json"],
            languageOptions: {
                ecmaVersion: 6,
            },
            name: "anolilab/no-secrets",
            plugins: {
                "no-secrets": noSecretsPlugin,
            },
            rules: {
                "no-secrets/no-secrets": "error",

                ...config.overrides,
            },
        },
    ];
};

export default noSecrets;
