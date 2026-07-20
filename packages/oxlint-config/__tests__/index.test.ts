import { describe, expect, it } from "vitest";

import config from "../src/index";

describe("@anolilab/oxlint-config", () => {
    it("exports the config object as default", () => {
        expect.assertions(1);

        expect(config).toBeTypeOf("object");
    });

    it("enables the correctness, suspicious and pedantic categories", () => {
        expect.assertions(3);

        expect(config.categories.correctness).toBe("error");
        expect(config.categories.suspicious).toBe("warn");
        expect(config.categories.pedantic).toBe("warn");
    });

    it("does not enable the style category (handled by oxfmt)", () => {
        expect.assertions(1);

        expect(config.categories).not.toHaveProperty("style");
    });

    it("declares a plugins array", () => {
        expect.assertions(2);

        expect(Array.isArray(config.plugins)).toBe(true);
        expect(config.plugins).toContain("typescript");
    });
});
