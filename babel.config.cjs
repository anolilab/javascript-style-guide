module.exports = {
    plugins: ["transform-es2015-modules-commonjs"],
    presets: [
        [
            "@babel/preset-env",
            {
                modules: "auto",
                targets: {
                    node: "current",
                },
            },
        ],
    ],
};
