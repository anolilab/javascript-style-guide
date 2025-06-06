const config = {
    rules: {
        // These rules are disabled because they conflict with tailwindcss
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "@tailwind",
                    "tailwind",
                    "apply",
                    "layer",
                    "config",
                    /** tailwindcss v1, v2 */
                    "variants",
                    "responsive",
                    "screen",
                ],
            },
        ],
        "function-no-unknown": [
            true,
            {
                ignoreFunctions: ["theme"],
            },
        ],
        "no-descending-specificity": null,
    },
};

export default config;
