const jestAsync = {
    plugins: ["jest-async"],
    rules: {
        "jest-async/expect-return": "error",
    },
};

export default jestAsync
