import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { jsxRuntimeOverrides } from "../src/index";

const writeTsconfig = (root: string, directory: string, jsx: string) => {
    const path = join(root, directory, "tsconfig.json");

    mkdirSync(join(root, directory), { recursive: true });
    writeFileSync(path, JSON.stringify({ compilerOptions: { jsx } }));

    return path;
};

describe("jsxRuntimeOverrides", () => {
    it("turns react-in-jsx-scope off under a tsconfig that uses the automatic runtime", () => {
        expect.hasAssertions();

        const root = mkdtempSync(join(tmpdir(), "oxlint-jsx-"));
        const path = writeTsconfig(root, "packages/app", "react-jsx");

        expect(jsxRuntimeOverrides([path])).toStrictEqual([{ files: [`${join(root, "packages/app")}/**`], rules: { "react/react-in-jsx-scope": "off" } }]);
    });

    it("also matches react-jsxdev", () => {
        expect.hasAssertions();

        const root = mkdtempSync(join(tmpdir(), "oxlint-jsx-"));
        const path = writeTsconfig(root, "packages/dev", "react-jsxdev");

        expect(jsxRuntimeOverrides([path])).toHaveLength(1);
    });

    it("adds nothing for the classic runtime, so the rule stays on", () => {
        expect.hasAssertions();

        const root = mkdtempSync(join(tmpdir(), "oxlint-jsx-"));
        const path = writeTsconfig(root, "packages/next", "preserve");

        expect(jsxRuntimeOverrides([path])).toStrictEqual([]);
    });
});
