#!/usr/bin/env node

// eslint-disable-next-line no-undef
if (process.env.CI) {
    // eslint-disable-next-line no-undef
    process.exit(0);
}

const { writeFile, existsSync } = require("node:fs");
// eslint-disable-next-line unicorn/import-style
const { resolve, join } = require("node:path");
const { promisify } = require("node:util");

const writeFileAsync = promisify(writeFile);

// get the path to the host project.
// eslint-disable-next-line no-undef
const projectPath = resolve(process.cwd(), "..", "..", "..");

console.log("Configuring @anolilab/babel-preset", projectPath, "\n");

/**
 * Writes babel.config.cjs if it doesn't exist. Warns if it exists.
 */
const writeBabelRc = () => {
    const eslintPath = join(projectPath, "babel.config.cjs");
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

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        await writeBabelRc();

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
