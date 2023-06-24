import { describe, expect, it } from "vitest";

import Index from "..";

const isWindows = process.platform === "win32";

describe("stylelint", () => {
    it("should output no error", async () => {
        expect.assertions(2);

        const distributionFolderPath = __dirname.replace("__tests__", "dist");

        // eslint-disable-next-line vitest/no-conditional-tests,vitest/no-conditional-in-test
        const pathReplaceValue = isWindows ? "\\" : "/";

        expect(Index.extends.length > 0).toBeTruthy();
        expect(Index.extends).toStrictEqual([
            `${distributionFolderPath}/config/a11y.mjs`.replace("/", pathReplaceValue),
            `${distributionFolderPath}/config/best-practices.mjs`.replace("/", pathReplaceValue),
            `${distributionFolderPath}/config/declaration-block-no-ignored-properties.mjs`.replace("/", pathReplaceValue),
            `${distributionFolderPath}/config/high-performance-animation.mjs`.replace("/", pathReplaceValue),
            `${distributionFolderPath}/config/no-unsupported-browser-features.mjs`.replace("/", pathReplaceValue),
            `${distributionFolderPath}/config/require-units.mjs`.replace("/", pathReplaceValue),
            `${distributionFolderPath}/config/selector-no-empty.mjs`.replace("/", pathReplaceValue),
            `${distributionFolderPath}/config/standard.mjs`.replace("/", pathReplaceValue),
            `${distributionFolderPath}/config/tailwindcss.mjs`.replace("/", pathReplaceValue),
            "stylelint-config-clean-order",
        ]);
    });
});
