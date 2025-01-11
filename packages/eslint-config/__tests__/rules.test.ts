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

import { execa } from "execa";
import { glob } from "tinyglobby";
import { afterAll, beforeAll, it } from "vitest";

import type { OptionsConfig, TypedFlatConfigItem } from "../src/types";

const rootPath = dirname(fileURLToPath(import.meta.url));
const fixturesPath = join(rootPath, "..", "__fixtures__");

const copyFolderRecursive = async (from: string, to: string) => {
    await mkdir(to, {
        recursive: true,
    });

    const files = await readdir(from, {
        recursive: true,
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const element of files) {
        // eslint-disable-next-line unicorn/no-await-expression-member,no-await-in-loop
        await ((await lstat(join(from, element))).isFile()
            ? copyFile(join(from, element), join(to, element))
            : copyFolderRecursive(join(from, element), join(to, element)));
    }
};

// eslint-disable-next-line vitest/require-top-level-describe
beforeAll(async () => {
    await rm(join(rootPath, "_fixtures"), { force: true, recursive: true });
});

// eslint-disable-next-line vitest/require-top-level-describe
afterAll(async () => {
    await rm(join(rootPath, "_fixtures"), { force: true, recursive: true });
});

const runWithConfig = (name: string, configs: OptionsConfig, ...items: TypedFlatConfigItem[]) => {
    // eslint-disable-next-line vitest/prefer-expect-assertions,vitest/require-top-level-describe
    it.concurrent(
        // eslint-disable-next-line vitest/valid-title
        name,
        async ({ expect }) => {
            const from = join(fixturesPath, "input");
            const output = join(fixturesPath, "output", name);

            const target = join(rootPath, "_fixtures", name);

            await copyFolderRecursive(from, target);
            await writeFile(
                join(target, "eslint.config.js"),
                `
// @eslint-disable
import { createConfig } from "@anolilab/eslint-config";

export default createConfig(
  ${JSON.stringify(configs)},
  ...(${JSON.stringify(items) ?? []}),
);
  `,
            );

            await execa("npx", ["eslint", target, "--fix"], {
                cwd: target,
                stdio: "pipe",
            });

            const files = await glob("**/*", {
                cwd: target,
                ignore: ["node_modules", "eslint.config.js"],
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
        },
        30_000,
    );
};

// eslint-disable-next-line vitest/require-hook
runWithConfig("js", {
    typescript: false,
    // vue: false,
});
// runWithConfig("all", {
//     astro: true,
//     // svelte: true,
//     typescript: true,
//     // vue: true,
// });
// runWithConfig("no-style", {
//     stylistic: false,
//     typescript: true,
//     vue: true,
// });
// runWithConfig(
//     "tab-double-quotes",
//     {
//         stylistic: {
//             indent: "tab",
//             quotes: "double",
//         },
//         typescript: true,
//         vue: true,
//     },
//     {
//         rules: {
//             "style/no-mixed-spaces-and-tabs": "off",
//         },
//     },
// );
//
// // https://github.com/antfu/eslint-config/issues/255
// runWithConfig(
//     "ts-override",
//     {
//         typescript: true,
//     },
//     {
//         rules: {
//             "ts/consistent-type-definitions": ["error", "type"],
//         },
//     },
// );
//
// // https://github.com/antfu/eslint-config/issues/255
// runWithConfig(
//     "ts-strict",
//     {
//         typescript: {
//             tsconfigPath: "./tsconfig.json",
//         },
//     },
//     {
//         rules: {
//             "ts/no-unsafe-return": ["off"],
//         },
//     },
// );
//
// // https://github.com/antfu/eslint-config/issues/618
// runWithConfig(
//     "ts-strict-with-react",
//     {
//         react: true,
//         typescript: {
//             tsconfigPath: "./tsconfig.json",
//         },
//     },
//     {
//         rules: {
//             "ts/no-unsafe-return": ["off"],
//         },
//     },
// );
//
// runWithConfig("with-formatters", {
//     astro: true,
//     formatters: true,
//     typescript: true,
//     vue: true,
// });
//
// runWithConfig("no-markdown-with-formatters", {
//     formatters: {
//         markdown: true,
//     },
//     jsx: false,
//     markdown: false,
//     vue: false,
// });
