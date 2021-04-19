module.exports = {
    testEnvironment: 'jest-environment-node',
    transform: {
        "\\.[jt]sx?$": "babel-jest",
        "\\.tsx?$": "ts-jest",
    },
    verbose: true,
    setupFiles: ["<rootDir>/setup-tests.js"],
    testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
    "transformIgnorePatterns": [
        "src/node_modules/(?!read-pkg-up)"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "<rootDir>/build/"
    ],
};
