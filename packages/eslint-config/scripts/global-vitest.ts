/**
 * This script is used to generate the globals used by vitest.
 *
 * A modified version of the original script from https://github.com/FRSOURCE/toolkit/blob/ac470422ba97837556c8a281e6ed4f73bcd0ba90/packages/globals-vitest
 *
 * MIT License
 * Copyright (c) 2024 FRSOURCE - Let's shape your web
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootPath = dirname(fileURLToPath(import.meta.url));

const BLOCK_COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;
const LINE_COMMENT_PATTERN = /\/\/[^\n]*/g;
const GLOBAL_BLOCK_PATTERN = /declare\s+global\s*\{([\s\S]*)\}/;
// Matched against one already-trimmed line at a time, so it cannot backtrack across the block.
const GLOBAL_DECLARATION_PATTERN = /^(?:declare\s+)?(?:let|const|var)\s+([\p{ID_Start}$_][\p{ID_Continue}$]*)/u;

const showMessageAndExit = (message: string, shouldFail = true) => {
    // eslint-disable-next-line no-console
    console.log(message);

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(shouldFail ? 1 : 0);
};

/**
 * Extracts the variable names declared inside vitest's `declare global { ... }` block.
 *
 * This used to walk the TypeScript AST via `ts.createProgram`, but TypeScript 7 (the native
 * port) no longer exposes the compiler API from the package root — its only root export is
 * `lib/version.cjs`. The declaration file is a flat list of `let <name>: ...` statements, so
 * scanning it directly avoids depending on a compiler API altogether.
 */
const extract = (file: string) => {
    const source = readFileSync(file, "utf8")
        // Strip comments so a commented-out declaration is never picked up as a global.
        .replaceAll(BLOCK_COMMENT_PATTERN, "")
        .replaceAll(LINE_COMMENT_PATTERN, "");

    const globalBlock = GLOBAL_BLOCK_PATTERN.exec(source)?.[1];

    if (globalBlock === undefined) {
        return [];
    }

    const globals: string[] = [];

    for (const line of globalBlock.split("\n")) {
        const name = GLOBAL_DECLARATION_PATTERN.exec(line.trim())?.[1];

        if (name !== undefined) {
            globals.push(name);
        }
    }

    return globals;
};

const require = createRequire(import.meta.url);
const packagePath = require.resolve("vitest/package.json");
const vitestDirectory = dirname(packagePath);

const {
    default: { version: vitestVersion },
} = await import(packagePath, {
    with: { type: "json" },
});

if (!vitestVersion) {
    showMessageAndExit("Vitest version cannot be read.");
}

const globalsPath = join(vitestDirectory, "globals.d.ts");

const globalsArray = extract(globalsPath);
const globals: Record<string, boolean> = {};

if (globalsArray.length === 0) {
    showMessageAndExit("No globals! Check extractor implementation.");
}

globalsArray.forEach((globalName) => {
    globals[globalName] = true;
});

const moduleContent = `/**
 * vitest version ${vitestVersion}
 */
export default /** @type {const} */ (${JSON.stringify(globals, undefined, 4)});
`;

writeFileSync(join(rootPath, "..", "src", "utils", "vitest-globals.ts"), moduleContent);

// eslint-disable-next-line no-console
console.log("Finished generation with result:\n", moduleContent);
