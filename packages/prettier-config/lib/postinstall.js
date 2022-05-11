#!/usr/bin/env node

import { existsSync, writeFile } from "node:fs";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

import content from "../index.cjs";

// eslint-disable-next-line no-undef
if (process.env.CI) {
    // eslint-disable-next-line no-undef
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

// get the path to the host project.
// eslint-disable-next-line no-undef
const projectPath = resolve(process.cwd(), "..", "..", "..");

console.log("Configuring @anolilab/prettier-config", projectPath, "\n");

/**
 * Writes .prettierrc.cjs if it doesn't exist. Warns if it exists.
 */
const writePrettierRc = () => {
    const prettierPath = join(projectPath, ".prettierrc.cjs");

    if (existsSync(prettierPath) || existsSync(prettierPath.replace(".cjs", ""))) {
        console.warn(`⚠️  .prettierrc.cjs already exists;
Make sure that it includes the following for @anolilab/prettier-config to work as it should:
${JSON.stringify(content, undefined, 4)}\n`);

        return Promise.resolve();
    }

    return writeFileAsync(
        prettierPath,
        `module.exports = ${JSON.stringify(content, undefined, 2).replace("rangeEnd: null,", "rangeEnd: Infinity,")}\n`,
        "utf-8",
    );
};

/**
 * Writes .prettierignore if it doesn't exist. Warns if it exists.
 */
const writePrettierIgnore = () => {
    const prettierPath = join(projectPath, ".prettierignore");

    if (existsSync(prettierPath)) {
        console.warn("⚠️  .prettierignore already exists");

        return Promise.resolve();
    }

    return writeFileAsync(prettierPath, "", "utf-8");
};

(async () => {
    try {
        // eslint-disable-next-line compat/compat
        await Promise.all([writePrettierRc(), writePrettierIgnore()]);

        console.log("😎  Everything went well, have fun!");

        // eslint-disable-next-line no-undef
        process.exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error.message);

        // eslint-disable-next-line no-undef
        process.exit(1);
    }
})();
