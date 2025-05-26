import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import removeIgnoredFiles from "../../src/eslint/remove-ignored-files";

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const __dirname = fileURLToPath(import.meta.url);
const fixturePath = join(__dirname, "..", "..", "..", "__fixtures__");

describe("remove-ignored-files", () => {
    it("should verity with non-ignored files", async () => {
        expect.assertions(1);

        const files = ["file1", "file2", "file3"];
        const result = await removeIgnoredFiles(files, new ESLint({
            cwd: join(fixturePath, "not-ignored-files"),
            overrideConfigFile: "eslint.config.js",
        }));

        expect(result).toHaveLength(0);
    });

    it("should verify with some ignored files", async () => {
        expect.assertions(1);

        const files = ["ignoredFile", "file1.js", "file2.js"];

        const result = await removeIgnoredFiles(files, new ESLint({
            cwd: join(fixturePath, "ignored-files"),
            overrideConfigFile: "eslint.config.js",
        }));

        expect(result).toHaveLength(2);
    });
});
