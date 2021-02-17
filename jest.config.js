module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    verbose: true,
    setupFiles: ["<rootDir>/setup-tests.js"]
};
