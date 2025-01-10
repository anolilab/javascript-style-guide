/**
 * This script is used to generate the globals used by vitest.
 *
 * A modified version of the original script from https://github.com/FRSOURCE/toolkit/blob/ac470422ba97837556c8a281e6ed4f73bcd0ba90/packages/globals-vitest
 *
 * MIT License
 * Copyright (c) 2024 FRSOURCE - Let's shape your web
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ModuleBody, SourceFile } from "typescript";
// eslint-disable-next-line import/no-extraneous-dependencies
import ts from "typescript";

const rootPath = dirname(fileURLToPath(import.meta.url));

const showMessageAndExit = (message: string, fail = true) => {
    // eslint-disable-next-line no-console
    console.log(message);

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(fail ? 1 : 0);
};

const extract = (file: string) => {
    const program = ts.createProgram([file], {});
    const sourceFile = program.getSourceFile(file) as SourceFile;
    const globals: string[] = [];

    ts.forEachChild(sourceFile, (node) => {
        if (ts.isModuleDeclaration(node)) {
            ts.forEachChild(node.body as ModuleBody, (mNode) => {
                if (ts.isVariableStatement(mNode)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ts.forEachChild(mNode, (vNode: any) => {
                        if (ts.isVariableDeclarationList(vNode)) {
                            // eslint-disable-next-line no-restricted-syntax
                            for (const declaration of vNode.declarations) {
                                const name = ts.getNameOfDeclaration(declaration);

                                if (name && "escapedText" in name) {
                                    globals.push(name.escapedText as string);
                                }
                            }
                        }
                    });
                }
            });
        }
    });

    return globals;
};

const require = createRequire(import.meta.url);
const packagePath = require.resolve("vitest/package.json");

const {
    default: { version: vitestVersion },
} = await import(packagePath, {
    with: { type: "json" },
});

if (!vitestVersion) {
    showMessageAndExit("Vitest version cannot be read.");
}

const globalsPath = require.resolve("vitest/globals.d.ts");

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
