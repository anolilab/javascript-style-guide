import { describe, expect, it } from "vitest";

import config from "../src";

describe("browserslist", () => {
    it("should output no error", async () => {
        expect.assertions(4);

        expect(config.production.length > 0).toBeTruthy();
        expect(config.legacyBrowsers.length > 0).toBeTruthy();
        expect(config.modernBrowsers.length > 0).toBeTruthy();
        expect(config.ssr.length > 0).toBeTruthy();
    });
});
