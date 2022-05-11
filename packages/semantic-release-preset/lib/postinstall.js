#!/usr/bin/env node

import { existsSync, readFileSync, writeFile } from "node:fs";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

// eslint-disable-next-line no-undef
if (process.env.CI) {
    // eslint-disable-next-line no-undef
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

// get the path to the host project.
// eslint-disable-next-line no-undef
const projectPath = resolve(process.cwd(), "..", "..", "..");

console.log("Configuring @anolilab/semantic-release-preset", projectPath, "\n");

/**
 * Writes .releaserc.json if it doesn't exist. Warns if it exists.
 */
const writeReleaserc = () => {
    const packageJsonPath = join(projectPath, "package.json");

    if (existsSync(packageJsonPath)) {
        const packageJsonContent = readFileSync(packageJsonPath, "utf8");

        if (packageJsonContent.includes("multi-semantic-release")) {
            console.warn("⚠️  found use of multi-semantic-release;");

            return Promise.resolve();
        }
    }

    const filePath = join(projectPath, ".releaserc.json");

    if (existsSync(filePath)) {
        console.warn("⚠️  .releaserc.json already exists;");

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
        console.warn("⚠️  commitlint.config.cjs already exists;");

        return Promise.resolve();
    }

    const content = `module.exports = {
    extends: ["@commitlint/config-conventional"],
};

`;

    return writeFileAsync(filePath, content, "utf-8");
};

/**
 * Writes .czrc if it doesn't exist. Warns if it exists.
 */
const writeCzrc = () => {
    const filePath = join(projectPath, ".czrc");

    if (existsSync(filePath)) {
        console.warn("⚠️  .czrc already exists;");

        return Promise.resolve();
    }

    const content = `{
  "path": "cz-conventional-changelog"
}

`;

    return writeFileAsync(filePath, content, "utf-8");
};

(async () => {
    try {
        await writeReleaserc();
        await writeCommitlintConfig();
        await writeCzrc();

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
