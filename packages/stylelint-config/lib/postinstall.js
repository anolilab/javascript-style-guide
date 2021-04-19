#!/usr/bin/env node

if (process.env.CI) {
    process.exit();
}

import { writeFile, existsSync } from 'fs';
import { resolve, join } from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

// get the path to the host project.
const projectPath = resolve(process.cwd(), '..', '..', '..');

console.log('Configuring @anolilab/stylelint-config', projectPath, '\n');

/**
 * Writes .stylelintrc.js if it doesn't exist. Warns if it exists.
 */
const writeStylelintRc = () => {
    const eslintPath = join(projectPath, '.stylelintrc.js');
    const content = `export default {
    "extends": [
        "@anolilab/stylelint-config",
    ]
};
`;

    if (existsSync(eslintPath)) {
        console.warn(`⚠️  .stylelintrc.js already exists;
Make sure that it includes the following for @anolilab/stylelint-config'
to work as it should: { presets: ["@anolilab/stylelint-config"] }.`);

        return Promise.resolve();
    }

    return writeFileAsync(eslintPath, content, 'utf-8');
};

/**
 * Writes .stylelintignore if it doesn't exist. Warns if it exists.
 */
const writeStylelintIgnore = () => {
    const eslintPath = join(projectPath, '.stylelintignore');
    const content = `package.json
package-lock.json
yarn.lock
build/**
node_modules/**
.next/**
`;

    if (existsSync(eslintPath)) {
        return Promise.resolve();
    }

    return writeFileAsync(eslintPath, content, "utf-8");
};

(async () => {
    try {
        await writeStylelintRc();
        await writeStylelintIgnore();

        console.log("😎  Everything went well, have fun!");

        process.exit();
    } catch (err) {
        console.log("😬  something went wrong:");
        console.error(err.message);

        process.exit(1);
    }
})();
