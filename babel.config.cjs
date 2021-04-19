module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "node": "current",
                },
                "modules": "auto"
            }
        ]
    ],
    "plugins": [
        "transform-es2015-modules-commonjs",
    ]
};
