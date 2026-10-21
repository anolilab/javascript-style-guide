import { describe, expect, it } from "vitest";

import node from "../src/config/plugins/node";

const esSyntaxOptions = async (packageJson: Record<string, unknown>) => {
    const configs = await node({ packageJson, files: ["**/*.ts"] } as Parameters<typeof node>[0]);
    const rule = configs.flatMap((config) => Object.entries(config.rules ?? {})).find(([name]) => name === "n/no-unsupported-features/es-syntax");

    return rule?.[1];
};

describe("node plugin version", () => {
    it("checks against engines.node when the project declares it", async () => {
        expect.hasAssertions();

        expect(await esSyntaxOptions({ engines: { node: ">=24.0.0" } })).toStrictEqual(["error", { ignores: ["modules"], version: "24.0.0" }]);
    });

    it("falls back to the oldest supported Node when engines.node is missing", async () => {
        expect.hasAssertions();

        expect(await esSyntaxOptions({})).toStrictEqual(["error", { ignores: ["modules"], version: "22.12.0" }]);
    });
});
