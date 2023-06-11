import { describe, expect, it } from "vitest";

import Index from "../index";

describe("stylelint", () => {
    it("should output no error", async () => {
        expect.assertions(1);

        expect(Index.extends.length > 0).toBeTruthy();
    });

    it("should have rules", async () => {
        expect.assertions(1);

        expect(Index.rules.indentation).toBe(4);
    });
});
