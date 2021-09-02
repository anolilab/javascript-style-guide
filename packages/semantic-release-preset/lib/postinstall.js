#!/usr/bin/env node

if (process.env.CI) {
    process.exit(0);
}

import { writeFile, existsSync, readFileSync } from 'fs';
import { resolve, join } from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

// get the path to the host project.
const projectPath = resolve(process.cwd(), '..', '..', '..');

console.log('Configuring @anolilab/semantic-release-preset', projectPath, '\n');

/**
 * Writes .releaserc.json if it doesn't exist. Warns if it exists.
 */
const writeReleaserc = () => {
    const packageJsonPath = join(projectPath, "package.json");
    const packageJsonContent = readFileSync(packageJsonPath, 'utf8');

    if (packageJsonContent.includes("multi-semantic-release")) {
        console.warn(`⚠️  found use of multi-semantic-release;`);

        return Promise.resolve();
    }

    const filePath = join(projectPath, ".releaserc.json");

    if (existsSync(filePath)) {
        console.warn(`⚠️  .releaserc.json already exists;`);

        return Promise.resolve();
    }

    const content = `{
    "extends": "@anolilab/semantic-release-preset"
}
`;

    return writeFileAsync(filePath, content, "utf-8");
};

/**
 * Writes commitlint.config.cjs if it doesn't exist. Warns if it exists.
 */
const writeCommitlintConfig = () => {
    const filePath = join(projectPath, "commitlint.config.cjs");

    if (existsSync(filePath)) {
        console.warn(`⚠️  commitlint.config.cjs already exists;`);

        return Promise.resolve();
    }

    const content = `module.exports = {
    extends: ["@commitlint/config-conventional"],
};

`;

    return writeFileAsync(filePath, content, "utf-8");
};

(async () => {
    try {
        await writeReleaserc();
        await writeCommitlintConfig();

        console.log("😎  Everything went well, have fun!");

        process.exit(0);
    } catch (err) {
        console.log("😬  something went wrong:");
        console.error(err.message);

        process.exit(1);
    }
})();
