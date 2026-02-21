import { describe, expect, it } from "vitest";

// @ts-expect-error - This is only used for testing
import IndexCJS from "../index.cjs";
import IndexESM from "../index.mjs";

const isWindows = process.platform === "win32";

describe("stylelint", () => {
    it("should output no error on esm errors", async () => {
        expect.assertions(2);

        const distributionFolderPath = __dirname.replace("__tests__", "dist");

        const pathReplaceValue = isWindows ? "\\" : "/";

        expect(IndexESM.extends.length).toBeGreaterThan(0);
        expect(IndexESM.extends).toStrictEqual([
            `${distributionFolderPath}/config/best-practices.mjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/declaration-block-no-ignored-properties.mjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/high-performance-animation.mjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/no-unsupported-browser-features.mjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/require-units.mjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/selector-no-empty.mjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/standard.mjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/tailwindcss.mjs`.replaceAll("/", pathReplaceValue),
            "stylelint-config-clean-order",
        ]);
    });

    it("should output no error on cjs errors", async () => {
        expect.assertions(2);

        const distributionFolderPath = __dirname.replace("__tests__", "dist");

        const pathReplaceValue = isWindows ? "\\" : "/";

        expect(IndexCJS.extends.length).toBeGreaterThan(0);
        expect(IndexCJS.extends).toStrictEqual([
            `${distributionFolderPath}/config/best-practices.cjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/declaration-block-no-ignored-properties.cjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/high-performance-animation.cjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/no-unsupported-browser-features.cjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/require-units.cjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/selector-no-empty.cjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/standard.cjs`.replaceAll("/", pathReplaceValue),
            `${distributionFolderPath}/config/tailwindcss.cjs`.replaceAll("/", pathReplaceValue),
            "stylelint-config-clean-order",
        ]);
    });
});
