import { describe, expect, it } from "vitest";

import config from "../src/index";

describe("@anolilab/oxfmt-config", () => {
    it("exports a config object as default", () => {
        expect.assertions(1);

        expect(config).toBeTypeOf("object");
    });

    it("mirrors the Anolilab prettier house style where oxfmt supports it", () => {
        expect.assertions(6);

        expect(config.printWidth).toBe(160);
        expect(config.tabWidth).toBe(4);
        expect(config.singleQuote).toBe(false);
        expect(config.semi).toBe(true);
        expect(config.trailingComma).toBe("all");
        expect(config.arrowParens).toBe("always");
    });

    it("only sets keys oxfmt actually supports", () => {
        expect.assertions(1);

        const supported = new Set([
            "arrowParens",
            "bracketSameLine",
            "bracketSpacing",
            "embeddedLanguageFormatting",
            "endOfLine",
            "htmlWhitespaceSensitivity",
            "insertFinalNewline",
            "jsxSingleQuote",
            "objectWrap",
            "overrides",
            "printWidth",
            "proseWrap",
            "quoteProps",
            "semi",
            "singleAttributePerLine",
            "singleQuote",
            "tabWidth",
            "trailingComma",
            "useTabs",
            "vueIndentScriptAndStyle",
        ]);

        const unknown = Object.keys(config).filter((key) => !supported.has(key));

        expect(unknown).toStrictEqual([]);
    });
});
