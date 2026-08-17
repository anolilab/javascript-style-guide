import { describe, expect, it } from "vitest";

import { getFiles, getOverrides, resolveSubOptions } from "../src/index";
import type { OptionsConfig } from "../src/types";
import interopDefault from "../src/utils/interop-default";
import { configItem, configPlugins, configRules } from "../src/utils/plugin-config";

describe("plugin-config", () => {
    it("reads rules, tolerating every broken shape", () => {
        expect.hasAssertions();
        expect(configRules({ rules: { a: "error" } })).toStrictEqual({ a: "error" });
        expect(configRules({ notRules: 1 })).toStrictEqual({});
        expect(configRules(undefined)).toStrictEqual({});
        expect(configRules(null)).toStrictEqual({});
        expect(configRules("nope")).toStrictEqual({});

        // A non-record `rules` must yield nothing rather than an index-keyed record: copying a
        // string would produce { 0: "o", 1: "o", ... } and emit a nonsense ESLint config.
        expect(configRules({ rules: "oops" })).toStrictEqual({});
        expect(configRules({ rules: ["a", "b"] })).toStrictEqual({});
        expect(configRules({ rules: null })).toStrictEqual({});
    });

    it("reads plugins and whole config items", () => {
        expect.hasAssertions();
        expect(configPlugins({ plugins: { p: 1 } })).toStrictEqual({ p: 1 });
        expect(configPlugins(null)).toStrictEqual({});
        expect(configItem({ name: "x", rules: { a: "error" } })).toStrictEqual({ name: "x", rules: { a: "error" } });
        expect(configItem(null)).toStrictEqual({});

        expect(configPlugins({ plugins: "oops" })).toStrictEqual({});
        expect(configPlugins({ plugins: ["a"] })).toStrictEqual({});
        expect(configItem(["not", "an", "item"])).toStrictEqual({});
        expect(configItem("nope")).toStrictEqual({});
    });
});

describe("interopDefault", () => {
    it("unwraps default from objects, functions, and leaves the rest alone", async () => {
        expect.hasAssertions();
        await expect(interopDefault({ default: { a: 1 } })).resolves.toStrictEqual({ a: 1 });
        await expect(interopDefault({ a: 1 })).resolves.toStrictEqual({ a: 1 });
        await expect(interopDefault(Promise.resolve({ default: 7 }))).resolves.toBe(7);

        // CJS plugin exported as a callable that also carries `default` — the regression case.
        const fn = Object.assign(() => "called", { default: { real: true } });

        await expect(interopDefault(fn)).resolves.toStrictEqual({ real: true });

        // `default: undefined` falls back to the module itself, as before.
        const withUndefined = { default: undefined, other: 1 };

        await expect(interopDefault(withUndefined)).resolves.toStrictEqual(withUndefined);
    });
});

describe("option resolvers", () => {
    it("resolves sub-options, overrides and files", () => {
        expect.hasAssertions();
        expect(resolveSubOptions({ react: true }, "react")).toStrictEqual({});
        expect(resolveSubOptions({ react: { files: ["a.tsx"] } }, "react")).toStrictEqual({ files: ["a.tsx"] });
        expect(resolveSubOptions({}, "react")).toStrictEqual({});

        expect(getOverrides({ react: { overrides: { "x/y": "error" } } }, "react")).toStrictEqual({ "x/y": "error" });
        expect(getOverrides({ react: true }, "react")).toStrictEqual({});
        expect(getOverrides({}, "react")).toStrictEqual({});

        // Same guard as above: a malformed `overrides` must not become an index-keyed record.
        const malformedOverrides: OptionsConfig = {};

        Object.assign(malformedOverrides, { react: { overrides: "oops" } });

        expect(getOverrides(malformedOverrides, "react")).toStrictEqual({});

        // A bare string is not in the declared type but is handled defensively at runtime.
        const withStringFiles: OptionsConfig = {};

        Object.assign(withStringFiles, { react: { files: "a.tsx" } });

        expect(getFiles(withStringFiles, "react")).toStrictEqual(["a.tsx"]);
        expect(getFiles({ react: { files: ["a.tsx", "b.tsx"] } }, "react")).toStrictEqual(["a.tsx", "b.tsx"]);
        expect(getFiles({ react: true }, "react")).toBeUndefined();
        expect(getFiles({}, "react")).toBeUndefined();
    });
});
