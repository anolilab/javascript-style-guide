import { Linter } from "eslint";
import { describe, expect, it } from "vitest";

import { createConfig } from "../src/index";

const lint = async (source: string, filename: string) => {
    const configs = (await createConfig({
        astro: false,
        css: false,
        formatters: false,
        html: false,
        jsonc: false,
        markdown: false,
        oxlint: false,
        stylistic: false,
        toml: false,
        yaml: false,
    })) as Linter.Config[];
    const linter = new Linter({ configType: "flat" });

    return linter.verify(source, configs, filename);
};

// The TypeScript block turns both rules off, so every case runs as a JavaScript file too.
const textEscapingCases = [
    ["file.ts", '/** Returns an `Id<"_storage">` for the file. */\nexport const id = (x: string): string => x;\n'],
    ["file.js", '/** Returns an `Id<"_storage">` for the file. */\nexport const id = (x) => x;\n'],
] as const;

const indentationCases = [
    [
        "file.ts",
        "/**\n * Options.\n *\n * - outer item\n *   - nested item\n *     continued\n *\n * @param x value\n */\nexport const options = (x: string): string => x;\n",
    ],
    ["file.js", "/**\n * Options.\n *\n * - outer item\n *   - nested item\n *     continued\n *\n * @param x value\n */\nexport const options = (x) => x;\n"],
] as const;

describe("jsdoc rules that broke real documentation", () => {
    it.each(textEscapingCases)("does not rewrite < inside a backtick code span in %s", async (filename, source) => {
        expect.hasAssertions();

        const messages = await lint(source, filename);

        expect(messages.filter((message) => message.ruleId === "jsdoc/text-escaping")).toStrictEqual([]);
    });

    it.each(indentationCases)("accepts nested lists and hanging indents in a description in %s", async (filename, source) => {
        expect.hasAssertions();

        const messages = await lint(source, filename);

        expect(messages.filter((message) => message.ruleId === "jsdoc/check-indentation")).toStrictEqual([]);
    });
});
