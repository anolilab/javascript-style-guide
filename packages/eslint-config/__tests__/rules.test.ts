import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import {
    copyFile,
    lstat,
    mkdir,
    readdir,
    readFile,
    rm,
    writeFile,
} from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { glob } from "tinyglobby";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { OptionsConfig, TypedFlatConfigItem } from "../src/types";

type CreateConfigOptions = Omit<TypedFlatConfigItem, "files"> & OptionsConfig;

const rootPath = dirname(fileURLToPath(import.meta.url));
const fixturesPath = join(rootPath, "..", "__fixtures__");
const temporaryDirectoryPath = join(rootPath, "..", "tmp_fixtures");

const copyFolderRecursive = async (from: string, to: string): Promise<void> => {
    await mkdir(to, {
        recursive: true,
    });

    const files = await readdir(from, {
        recursive: true,
    });

    const copyFileOrFolder = async (
        sourcePath: string,
        targetPath: string,
    ): Promise<void> => {
        const stat = await lstat(sourcePath);

        return stat.isFile()
            ? copyFile(sourcePath, targetPath)
            : copyFolderRecursive(sourcePath, targetPath);
    };

    await Promise.all(
        files.map((element) =>
            copyFileOrFolder(join(from, element), join(to, element)),
        ),
    );
};

const execCommand = (
    command: string,
    arguments_: string[],
    cwd: string,
): Promise<void> =>
    new Promise((resolve, reject) => {
        const child = spawn(command, arguments_, {
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
                reject(
                    new Error(
                        `Command failed with code ${String(code)}:\n${stderr}`,
                    ),
                );
            }
        });

        child.on("error", reject);
    });

const runWithConfig = async (
    name: string,
    configs: CreateConfigOptions,
    items: TypedFlatConfigItem[] = [],
): Promise<void> => {
    const from = join(fixturesPath, "input");
    const output = join(fixturesPath, "output", name);
    const target = join(temporaryDirectoryPath, name);

    await copyFolderRecursive(from, target);

    // Create a minimal package.json to prevent inheriting parent dependencies
    await writeFile(
        join(target, "package.json"),
        `{
  "name": "eslint-config-test-${name}",
  "private": true,
  "type": "module"
}`,
    );

    const existingIgnores = configs.ignores ?? [];
    const configWithIgnores: CreateConfigOptions = {
        ...configs,
        ignores: [...existingIgnores, "**/eslint.config.js"],
    };

    await writeFile(
        join(target, "eslint.config.js"),
        `/* eslint-disable */
import { createConfig } from "../../dist/index.js";

export default createConfig(
  ${JSON.stringify(configWithIgnores)},
  ...(${JSON.stringify(items) ?? []})
);
`,
    );

    await execCommand("npx", ["eslint", ".", "--fix"], target);

    const files = await glob("**/*", {
        cwd: target,
        ignore: ["node_modules", "eslint.config.js", "package.json"],
    });

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

            await expect.soft(content).toMatchFileSnapshot(join(output, file));
        }),
    );
};

describe("eslint-config rules", () => {
    beforeAll(async () => {
        await rm(temporaryDirectoryPath, { force: true, recursive: true });
    });

    afterAll(async () => {
        await rm(temporaryDirectoryPath, { force: true, recursive: true });
    });

    it("should lint with js config", async () => {
        expect.hasAssertions();

        await runWithConfig("js", {
            typescript: false,
            vitest: false,
        });
    }, 30_000);

    it("should lint with all config", async () => {
        expect.hasAssertions();

        await runWithConfig("all", {
            astro: true,
            typescript: true,
        });
    }, 30_000);

    it("should lint with no-style config", async () => {
        expect.hasAssertions();

        await runWithConfig("no-style", {
            stylistic: false,
            typescript: true,
        });
    }, 30_000);

    // Note: tab-double-quotes test is skipped because unicorn/template-indent doesn't accept "tab" as string value

    it("should lint with ts-override config", async () => {
        expect.hasAssertions();

        await runWithConfig(
            "ts-override",
            {
                typescript: true,
            },
            [
                {
                    rules: {
                        "@typescript-eslint/consistent-type-definitions": [
                            "error",
                            "type",
                        ],
                    },
                },
            ],
        );
    }, 30_000);

    it("should lint with ts-strict config", async () => {
        expect.hasAssertions();

        await runWithConfig(
            "ts-strict",
            {
                typescript: {
                    tsconfigPath: "./tsconfig.json",
                },
            },
            [
                {
                    rules: {
                        "@typescript-eslint/no-unsafe-return": ["off"],
                    },
                },
            ],
        );
    }, 30_000);

    it("should lint with ts-strict-with-react config", async () => {
        expect.hasAssertions();

        await runWithConfig(
            "ts-strict-with-react",
            {
                react: true,
                typescript: {
                    tsconfigPath: "./tsconfig.json",
                },
            },
            [
                {
                    rules: {
                        "@typescript-eslint/no-unsafe-return": ["off"],
                    },
                },
            ],
        );
    }, 30_000);

    it("should lint with formatters config", async () => {
        expect.hasAssertions();

        await runWithConfig("with-formatters", {
            astro: true,
            formatters: true,
            typescript: true,
        });
    }, 30_000);

    it("should lint with no-markdown-with-formatters config", async () => {
        expect.hasAssertions();

        await runWithConfig("no-markdown-with-formatters", {
            formatters: {
                markdown: true,
            },
            jsx: false,
            markdown: false,
        });
    }, 30_000);
});
