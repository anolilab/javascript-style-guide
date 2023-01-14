import { describe, expect, it } from "vitest";

// eslint-disable-next-line unicorn/prefer-module,@typescript-eslint/no-require-imports
const config = require("../index.cjs") as {
    extends: string[];
    plugins: string[];
    ignorePatterns: string[];
};

describe("eslint", () => {
    it("should output no error", async () => {
        expect.assertions(3);

        expect(config.extends.length > 0).toBeTruthy();
        expect(config.plugins.length > 0).toBeTruthy();
        expect(config.ignorePatterns.length > 0).toBeTruthy();
    });
});
