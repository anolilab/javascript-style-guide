import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import oxlint, { jsPluginRuleOverrides } from "../src/config/plugins/oxlint";

const sharedOxlintPath = join(__dirname, "../../oxlint-config/.oxlintrc.json");
const sharedOxlintFile = JSON.parse(readFileSync(sharedOxlintPath, "utf8")) as Parameters<typeof jsPluginRuleOverrides>[0];

const CORE_ONLY = new Set([""]);
const WITH_JSX_A11Y = new Set(["", "jsx-a11y"]);

const offRules = (configs: { rules?: Record<string, unknown> }[]) =>
    new Set(
        configs.flatMap((config) =>
            Object.entries(config.rules ?? {})
                .filter(([, s]) => s === "off")
                .map(([r]) => r),
        ),
    );

describe("oxlint plugin wiring", () => {
    it("turns off the JS-plugin rules in the config ESLint returns when oxlint's file is used", async () => {
        expect.hasAssertions();

        const off = offRules(await oxlint({ configFile: sharedOxlintPath }));

        expect(off.has("sonarjs/cognitive-complexity")).toBe(true);
        expect(off.has("no-secrets/no-secrets")).toBe(true);
        expect(off.has("no-empty")).toBe(true);
    });

    it("follows extends, so a consumer file that only extends the shared config still turns off the JS-plugin rules", async () => {
        expect.hasAssertions();

        const dir = mkdtempSync(join(tmpdir(), "oxlint-extends-"));
        const consumer = join(dir, ".oxlintrc.json");

        writeFileSync(consumer, JSON.stringify({ extends: [sharedOxlintPath], rules: { "sonarjs/cognitive-complexity": "off" } }));

        const off = offRules(await oxlint({ configFile: consumer }));

        // The consumer turns this one off in oxlint, so oxlint no longer runs it and ESLint keeps it.
        expect(off.has("sonarjs/no-collapsible-if")).toBe(true);
        expect(off.has("sonarjs/cognitive-complexity")).toBe(false);
    });
});

describe("jsPluginRuleOverrides", () => {
    it("turns off every ESLint rule the shared oxlint config runs through a JS plugin", () => {
        expect.hasAssertions();

        const overrides = jsPluginRuleOverrides(sharedOxlintFile, CORE_ONLY);

        expect(overrides["sonarjs/cognitive-complexity"]).toBe("off");
        expect(overrides["regexp/no-unused-capturing-group"]).toBe("off");
        expect(overrides["eslint-comments/no-unused-disable"]).toBe("off");
        expect(overrides["no-secrets/no-secrets"]).toBe("off");
    });

    it("never turns off an ESLint rule under the react-doctor prefix, since ESLint has no such plugin", () => {
        expect.hasAssertions();

        const keys = Object.keys(jsPluginRuleOverrides(sharedOxlintFile, new Set(["", "jsx-a11y", "react", "react-hooks"])));

        expect(keys.filter((key) => key.startsWith("react-doctor/"))).toStrictEqual([]);
    });

    it("maps a React Doctor rule with a namesake to the ESLint rule, and keeps core namesakes loaded", () => {
        expect.hasAssertions();

        const file = {
            jsPlugins: [{ name: "react-doctor", specifier: "oxlint-plugin-react-doctor" }],
            rules: { "react-doctor/alt-text": "error", "react-doctor/no-eval": "error" },
        };

        expect(jsPluginRuleOverrides(file, WITH_JSX_A11Y)).toStrictEqual({ "jsx-a11y/alt-text": "off", "no-eval": "off" });
        expect(jsPluginRuleOverrides(file, CORE_ONLY)).toStrictEqual({ "no-eval": "off" });
    });

    it("leaves native oxlint rules to eslint-plugin-oxlint", () => {
        expect.hasAssertions();

        const overrides = jsPluginRuleOverrides(sharedOxlintFile, CORE_ONLY);

        expect(overrides).not.toHaveProperty("no-empty");
        expect(overrides).not.toHaveProperty("unicorn/filename-case");
    });

    it("accepts plugin entries written as bare package specifiers", () => {
        expect.hasAssertions();

        expect(
            jsPluginRuleOverrides(
                {
                    jsPlugins: ["eslint-plugin-sonarjs"],
                    rules: { "sonarjs/no-collapsible-if": "warn" },
                },
                CORE_ONLY,
            ),
        ).toStrictEqual({ "sonarjs/no-collapsible-if": "off" });
    });

    it("does not override rules the file turns off", () => {
        expect.hasAssertions();

        expect(
            jsPluginRuleOverrides(
                {
                    jsPlugins: [{ name: "sonarjs", specifier: "eslint-plugin-sonarjs" }],
                    rules: { "sonarjs/cognitive-complexity": "off", "sonarjs/no-collapsible-if": ["error", {}] },
                },
                CORE_ONLY,
            ),
        ).toStrictEqual({ "sonarjs/no-collapsible-if": "off" });
    });

    it("returns nothing when the file enables no JS-plugin rules", () => {
        expect.hasAssertions();

        expect(jsPluginRuleOverrides({ rules: { "unicorn/no-null": "error" } }, CORE_ONLY)).toStrictEqual({});
    });
});
