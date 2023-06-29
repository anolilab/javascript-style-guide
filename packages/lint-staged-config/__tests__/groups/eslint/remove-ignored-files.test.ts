import { describe, expect, it } from "vitest";

import removeIgnoredFiles from "../../../src/groups/eslint/remove-ignored-files";

describe("remove-ignored-files", () => {
    it("should verity with non-ignored files", async () => {
        const files = ["file1", "file2", "file3"];
        const result = await removeIgnoredFiles(files);

        expect(result).toHaveLength(files.length);

        result.forEach((file) => expect(file).toMatch(/"file\d"/));
    });

    // TODO: find a good way to mock eslint.isPathIgnored
    // eslint-disable-next-line vitest/no-disabled-tests
    it.skip("should verify with some ignored files", async () => {
        const files = ["ignoredFile", "file1", "file2"];
        const result = await removeIgnoredFiles(files);

        expect(result).toHaveLength(files.length - 2);

        result.forEach((file) => expect(file).toMatch(/"file\d"/));
    });
});
