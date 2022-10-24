module.exports = {
    extends: ["plugin:toml/standard"],
    overrides: [
        {
            files: ["*.toml"],
            parser: "toml-eslint-parser",
        },
    ],
};
