#!/usr/bin/env node

if (process.env.CI) {
    process.exit(0);
}

import { writeFile, existsSync } from 'fs';
import { resolve, join } from 'path';
import { promisify } from 'util';
import content from '../index.js';

const writeFileAsync = promisify(writeFile);

// get the path to the host project.
const projectPath = resolve(process.cwd(), '..', '..', '..');

console.log('Configuring @anolilab/prettier-config', projectPath, '\n');

/**
 * Writes .prettierrc.cjs if it doesn't exist. Warns if it exists.
 */
const writePrettierRc = () => {
    const prettierPath = join(projectPath, '.prettierrc.cjs');

    if (existsSync(prettierPath) || existsSync(prettierPath.replace('.cjs', ''))) {
        console.warn(`⚠️  .prettierrc.cjs already exists;
Make sure that it includes the following for @anolilab/prettier-config to work as it should:
${JSON.stringify(content, null, 4)}\n`);

        return Promise.resolve();
    }

    return writeFileAsync(
        prettierPath,
        `module.exports = ${JSON.stringify(content, null, 2).replace("rangeEnd: null,", "rangeEnd: Infinity,")}\n`,
        'utf-8',
    );
};

/**
 * Writes .prettierignore if it doesn't exist. Warns if it exists.
 */
const writePrettierIgnore = () => {
    const prettierPath = join(projectPath, '.prettierignore');

    if (existsSync(prettierPath)) {
        console.warn(`⚠️  .prettierignore already exists`);

        return Promise.resolve();
    }

    return writeFileAsync(prettierPath, "", "utf-8");
};

(async () => {
    try {
        await Promise.all([writePrettierRc(), writePrettierIgnore()]);

        console.log("😎  Everything went well, have fun!");

        process.exit(0);
    } catch (err) {
        console.log("😬  something went wrong:");
        console.error(err.message);

        process.exit(1);
    }
})();
