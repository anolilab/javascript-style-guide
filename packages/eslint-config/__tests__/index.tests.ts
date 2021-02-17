import Index from "./../index"

describe("eslint", () => {
    it("should output no error", async () => {
        expect.assertions(3)

        expect(Index.extends.length !== 0).toBeTruthy()
        expect(Index.plugins.length !== 0).toBeTruthy()
        expect(Index.ignorePatterns.length !== 0).toBeTruthy()
    })
})
