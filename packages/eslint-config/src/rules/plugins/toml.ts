const config = {
    extends: ["plugin:toml/standard"],
    overrides: [
        {
            files: ["*.toml"],
            parser: "toml-eslint-parser",
        },
    ],
};

export default config;
