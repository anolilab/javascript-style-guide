import { describe, expect, it } from "vitest";

import config from "../src";

describe("eslint", () => {
    it("should output no error", async () => {
        expect.assertions(3);

        expect(config.extends.length > 0).toBeTruthy();
        expect(config.plugins.length > 0).toBeTruthy();
        expect(config.ignorePatterns.length > 0).toBeTruthy();
    });
});
