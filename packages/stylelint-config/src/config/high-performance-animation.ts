const config = {
    // prevent use of low performance animation and transition properties.
    plugins: ["stylelint-high-performance-animation"],
    rules: {
        'plugin/no-low-performance-animation-properties': true,
    },
};

export default config;
