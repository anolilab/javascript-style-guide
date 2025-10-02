import { describe, expect, it } from "vitest";

import IndexESM from "../index.mjs";
// @ts-expect-error - This is only used for testing
import IndexCJS from "../index.cjs";

const isWindows = process.platform === "win32";

describe("stylelint", () => {
    it("should output no error on esm errors", async () => {
        expect.assertions(2);

        const distributionFolderPath = __dirname.replace("__tests__", "dist");

        // eslint-disable-next-line vitest/no-conditional-tests,vitest/no-conditional-in-test
        const pathReplaceValue = isWindows ? "\\" : "/";

        expect(IndexESM.extends.length > 0).toBeTruthy();
        expect(IndexESM.extends).toStrictEqual([
            `${distributionFolderPath}/config/best-practices.mjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/declaration-block-no-ignored-properties.mjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/high-performance-animation.mjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/no-unsupported-browser-features.mjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/require-units.mjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/selector-no-empty.mjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/standard.mjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/tailwindcss.mjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            "stylelint-config-clean-order",
        ]);
    });

    it("should output no error on cjs errors", async () => {
        expect.assertions(2);

        const distributionFolderPath = __dirname.replace("__tests__", "dist");

        // eslint-disable-next-line vitest/no-conditional-tests,vitest/no-conditional-in-test
        const pathReplaceValue = isWindows ? "\\" : "/";

        expect(IndexCJS.extends.length > 0).toBeTruthy();
        expect(IndexCJS.extends).toStrictEqual([
            `${distributionFolderPath}/config/best-practices.cjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/declaration-block-no-ignored-properties.cjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/high-performance-animation.cjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/no-unsupported-browser-features.cjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/require-units.cjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/selector-no-empty.cjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/standard.cjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            `${distributionFolderPath}/config/tailwindcss.cjs`.replaceAll(
                "/",
                pathReplaceValue,
            ),
            "stylelint-config-clean-order",
        ]);
    });
});
