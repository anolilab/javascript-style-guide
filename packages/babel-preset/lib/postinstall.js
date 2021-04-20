#!/usr/bin/env node

if (process.env.CI) {
    process.exit(0);
}

import { writeFile, existsSync } from 'fs';
import { resolve, join } from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

// get the path to the host project.
const projectPath = resolve(process.cwd(), '..', '..', '..');

console.log('Configuring @anolilab/babel-preset', projectPath, '\n');

/**
 * Writes babel.config.cjs if it doesn't exist. Warns if it exists.
 */
const writeBabelRc = () => {
    const eslintPath = join(projectPath, 'babel.config.cjs');
    const content = `module.exports = {
    presets: ["@anolilab/babel-preset"]
};
`;

    if (existsSync(eslintPath)) {
        console.warn(`⚠️  babel.config.cjs already exists;
Make sure that it includes the following for @anolilab/babel-preset'
to work as it should: { presets: ["@anolilab/babel-preset"] }.`);

        return Promise.resolve();
    }

    return writeFileAsync(eslintPath, content, "utf-8");
};

(async () => {
    try {
        await writeBabelRc();

        console.log("😎  Everything went well, have fun!");

        process.exit(0);
    } catch (err) {
        console.log("😬  something went wrong:");
        console.error(err.message);

        process.exit(1);
    }
})();
