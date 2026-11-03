import { Linter } from "eslint";
import { describe, expect, it } from "vitest";

import { createConfig } from "../src/index";

const lint = async (source: string) => {
    const configs = await createConfig({
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
    });
    const linter = new Linter({ configType: "flat" });

    return linter.verify(source, configs, "file.ts");
};

describe("jsdoc rules that broke real documentation", () => {
    it("does not rewrite < inside a backtick code span", async () => {
        expect.hasAssertions();

        const messages = await lint('/** Returns an `Id<"_storage">` for the file. */\nexport const id = (x: string): string => x;\n');

        expect(messages.filter((message) => message.ruleId === "jsdoc/text-escaping")).toStrictEqual([]);
    });

    it("accepts nested lists and hanging indents in a description", async () => {
        expect.hasAssertions();

        const messages = await lint(
            "/**\n * Options.\n *\n * - outer item\n *   - nested item\n *     continued\n *\n * @param x value\n */\nexport const options = (x: string): string => x;\n",
        );

        expect(messages.filter((message) => message.ruleId === "jsdoc/check-indentation")).toStrictEqual([]);
    });
});
