import Index from "../index.cjs";

describe("eslint", () => {
    it("should output no error", async () => {
        expect.assertions(1);

        expect(Index.extends.length !== 0).toBeTruthy();
    });
});
