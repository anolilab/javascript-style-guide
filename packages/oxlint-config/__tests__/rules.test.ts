import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, lstat, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

const rootPath = dirname(fileURLToPath(import.meta.url));
const packagePath = join(rootPath, "..");
const presetPath = join(packagePath, ".oxlintrc.json");
const fixturesPath = join(packagePath, "__fixtures__");
const temporaryDirectoryPath = join(packagePath, "tmp_fixtures");
const oxlintPath = join(packagePath, "node_modules", ".bin", "oxlint");

// oxlint runs on a cold cache in a few seconds; the default test timeout is too short for the first fixture run.
const fixtureTimeout = 60_000;

const listFiles = async (directory: string): Promise<string[]> => {
    const entries = await readdir(directory, { recursive: true });
    const files: string[] = [];

    for (const entry of entries) {
        if ((await lstat(join(directory, entry))).isFile()) {
            files.push(entry);
        }
    }

    return files;
};

// oxlint exits with 1 when it still reports problems after fixing; only a crash or a bad config fails the run.
const execOxlint = (arguments_: string[], cwd: string): Promise<void> =>
    new Promise((resolve, reject) => {
        const child = spawn(oxlintPath, arguments_, {
            cwd,
            stdio: "pipe",
        });

        let stderr = "";

        child.stderr?.on("data", (data: Buffer) => {
            stderr += data.toString();
        });

        child.on("close", (code) => {
            if (code === 0 || code === 1) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${String(code)}:\n${stderr}`));
            }
        });

        child.on("error", reject);
    });

const runWithConfig = async (name: string, rules: Record<string, unknown> = {}): Promise<void> => {
    const from = join(fixturesPath, "input");
    const output = join(fixturesPath, "output", name);
    const target = join(temporaryDirectoryPath, name);

    await cp(from, target, { recursive: true });

    // The extending file is written into the copy, so oxlint resolves the preset by absolute path.
    await writeFile(
        join(target, ".oxlintrc.json"),
        JSON.stringify({
            extends: [presetPath],
            rules,
        }),
    );

    await execOxlint(["--fix", "-c", ".oxlintrc.json", "."], target);

    const files = await listFiles(from);

    await Promise.all(
        files.map(async (file: string) => {
            const content = await readFile(join(target, file), "utf8");
            const source = await readFile(join(from, file), "utf8");
            const outputPath = join(output, file);

            if (content === source) {
                if (existsSync(outputPath)) {
                    await rm(outputPath);
                }

                return;
            }

            await expect.soft(content).toMatchFileSnapshot(outputPath);
        }),
    );
};

describe("oxlint-config rules", () => {
    beforeAll(async () => {
        await rm(temporaryDirectoryPath, { force: true, recursive: true });
    });

    afterAll(async () => {
        await rm(temporaryDirectoryPath, { force: true, recursive: true });
    });

    it(
        "should fix with the preset",
        async () => {
            expect.hasAssertions();

            await runWithConfig("default");
        },
        fixtureTimeout,
    );

    it(
        "should fix with an override of a TypeScript rule",
        async () => {
            expect.hasAssertions();

            await runWithConfig("ts-override", {
                "typescript/consistent-type-definitions": ["error", "type"],
            });
        },
        fixtureTimeout,
    );
});
