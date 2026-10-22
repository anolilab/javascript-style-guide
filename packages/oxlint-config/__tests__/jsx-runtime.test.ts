import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { jsxRuntimeOverrides } from "../src/index";

const roots: string[] = [];

// The helper takes paths relative to the oxlint config directory, so fixtures live under the working directory.
const makeRoot = (): string => {
    const root = mkdtempSync(".jsx-runtime-");

    roots.push(root);

    return root;
};

const writeTsconfig = (root: string, directory: string, jsx: string) => {
    const path = join(root, directory, "tsconfig.json");

    mkdirSync(join(root, directory), { recursive: true });
    writeFileSync(path, JSON.stringify({ compilerOptions: { jsx } }));

    return path;
};

afterEach(() => {
    for (const root of roots.splice(0)) {
        rmSync(root, { force: true, recursive: true });
    }
});

describe("jsxRuntimeOverrides", () => {
    it("turns react-in-jsx-scope off under a tsconfig that uses the automatic runtime", () => {
        expect.hasAssertions();

        const root = makeRoot();
        const path = writeTsconfig(root, "packages/app", "react-jsx");

        expect(jsxRuntimeOverrides([path])).toStrictEqual([{ files: [`${root}/packages/app/**`], rules: { "react/react-in-jsx-scope": "off" } }]);
    });

    it("also matches react-jsxdev", () => {
        expect.hasAssertions();

        const root = makeRoot();
        const path = writeTsconfig(root, "packages/dev", "react-jsxdev");

        expect(jsxRuntimeOverrides([path])).toHaveLength(1);
    });

    it("adds nothing for the classic runtime, so the rule stays on", () => {
        expect.hasAssertions();

        const root = makeRoot();
        const path = writeTsconfig(root, "packages/next", "preserve");

        expect(jsxRuntimeOverrides([path])).toStrictEqual([]);
    });
});
