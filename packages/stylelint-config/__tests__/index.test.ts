import { describe, expect, it } from "vitest";

import Index from "..";

describe("stylelint", () => {
    it("should output no error", async () => {
        expect.assertions(2);

        const distFolderPath = __dirname.replace("__tests__", "dist");

        expect(Index.extends.length > 0).toBeTruthy();
        expect(Index.extends).toEqual([
            `${distFolderPath}/config/a11y.mjs`,
            `${distFolderPath}/config/best-practices.mjs`,
            `${distFolderPath}/config/declaration-block-no-ignored-properties.mjs`,
            `${distFolderPath}/config/high-performance-animation.mjs`,
            `${distFolderPath}/config/no-unsupported-browser-features.mjs`,
            `${distFolderPath}/config/require-units.mjs`,
            `${distFolderPath}/config/selector-no-empty.mjs`,
            `${distFolderPath}/config/standard.mjs`,
            `${distFolderPath}/config/tailwindcss.mjs`,
            "stylelint-config-clean-order",
        ]);
    });
});
