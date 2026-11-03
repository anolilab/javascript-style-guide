import { matchesGlob } from "node:path";

import { describe, expect, it } from "vitest";

import config from "../src/index";

/** The value oxlint uses for `rule` in `file`: the base rules, then every matching override in order. */
const effectiveRule = (file: string, rule: string): unknown => {
    let value: unknown = (config.rules as Record<string, unknown>)[rule];

    for (const override of config.overrides as { files: string[]; rules: Record<string, unknown> }[]) {
        if (override.files.some((glob) => matchesGlob(file, glob)) && rule in override.rules) {
            value = override.rules[rule];
        }
    }

    return value;
};

/** The severity of a rule value, which is either the severity or `[severity, ...options]`. */
const severityOf = (value: unknown): unknown => (Array.isArray(value) ? value[0] : value);

describe("@anolilab/oxlint-config", () => {
    it("exports the config object as default", () => {
        expect.assertions(1);

        expect(config).toBeTypeOf("object");
    });

    it("enables only the correctness category; every other rule is listed explicitly", () => {
        expect.assertions(2);

        expect(config.categories).toStrictEqual({ correctness: "error" });
        expect(config.categories).not.toHaveProperty("pedantic");
    });

    it("enables the ESLint rules oxlint implements, in the file kinds ESLint enables them for", () => {
        expect.assertions(4);

        expect(effectiveRule("src/index.ts", "no-console")).toStrictEqual(["warn", {}]);
        expect(effectiveRule("src/index.ts", "import/no-duplicates")).toBe("error");
        expect(severityOf(effectiveRule("src/app.tsx", "jsx-a11y/alt-text"))).toBe("error");
        expect(severityOf(effectiveRule("src/index.ts", "jsx-a11y/alt-text"))).toBe("off");
    });

    it("turns the jsdoc rules off for TypeScript files, as @anolilab/eslint-config does", () => {
        expect.assertions(2);

        expect(effectiveRule("src/index.ts", "jsdoc/require-param-type")).toBe("off");
        expect(effectiveRule("src/index.ts", "jsdoc/require-returns")).toBe("off");
    });

    it("does not enable the style category (handled by oxfmt)", () => {
        expect.assertions(1);

        expect(config.categories).not.toHaveProperty("style");
    });

    it("loads sonarjs, regexp, eslint-comments, no-secrets and react-doctor as JS plugins", () => {
        expect.hasAssertions();

        const names = config.jsPlugins.map((plugin) => plugin.name);

        expect(names).toStrictEqual(["sonarjs", "regexp", "eslint-comments", "no-secrets", "react-doctor"]);
        expect(config.rules["sonarjs/cognitive-complexity"]).toBeDefined();
        expect(Object.keys(config.rules).filter((rule) => rule.startsWith("react-doctor/")).length).toBeGreaterThan(800);
    });

    it("turns on type-aware linting so the typescript/* rules that need type information run", () => {
        expect.hasAssertions();

        expect(config.options.typeAware).toBe(true);
        expect(config.rules["typescript/no-floating-promises"]).toBe("error");
    });

    it("leaves out React Doctor rules that oxlint already runs natively under the same name", () => {
        expect.hasAssertions();

        expect(config.rules).not.toHaveProperty("react-doctor/alt-text");
        expect(config.rules).not.toHaveProperty("react-doctor/no-eval");
        expect(effectiveRule("src/app.tsx", "react/rules-of-hooks")).toBe("error");
    });

    it("only enables rules whose plugin is declared", () => {
        expect.hasAssertions();

        const declared = new Set([...config.plugins, ...config.jsPlugins.map((plugin) => plugin.name)]);
        const undeclared = Object.keys(config.rules).filter((rule) => rule.includes("/") && !declared.has(rule.slice(0, rule.indexOf("/"))));

        expect(undeclared).toStrictEqual([]);
    });

    it("declares a plugins array", () => {
        expect.assertions(2);

        expect(Array.isArray(config.plugins)).toBe(true);
        expect(config.plugins).toContain("typescript");
    });
});
