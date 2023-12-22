import { exec } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

const ONE_SECOND_IN_MS = 1000;

const TEST_DIR = join(__dirname, "../__fixtures__", "old-config");
const NODE_MODULES = join(TEST_DIR, "node_modules");

const execAsync = promisify(exec);

describe("integration - old config", () => {
    beforeEach(async () => {
        await rm(NODE_MODULES, { force: true, recursive: true });
    });

    afterEach(async () => {
        await rm(NODE_MODULES, { recursive: true });
    });

    it(
        "installs & works",
        async () => {
            expect.assertions(2);
            await execAsync("pnpm --ignore-workspace i", { cwd: TEST_DIR });

            const { stderr, stdout } = await execAsync("pnpm exec eslint -c ./.eslintrc.js . || true", {
                cwd: TEST_DIR,
                env: { ...process.env, FORCE_COLOR: "0" },
            });

            expect(stderr.replace(TEST_DIR, "mocked-root-dir")).toContain("");
            expect(stdout.replace(TEST_DIR, "mocked-root-dir")).toContain("4 problems (3 errors, 1 warning)");
        },
        240 * ONE_SECOND_IN_MS,
    );
});
