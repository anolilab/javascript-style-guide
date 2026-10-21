import { describe, expect, it } from "vitest";

import config from "../src/index";

describe("@anolilab/oxlint-config", () => {
    it("exports the config object as default", () => {
        expect.assertions(1);

        expect(config).toBeTypeOf("object");
    });

    it("enables the correctness, suspicious and pedantic categories", () => {
        expect.assertions(3);

        expect(config.categories.correctness).toBe("error");
        expect(config.categories.suspicious).toBe("warn");
        expect(config.categories.pedantic).toBe("warn");
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
        expect(config.rules["react/rules-of-hooks"]).toBe("error");
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
