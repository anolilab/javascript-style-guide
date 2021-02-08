#!/usr/bin/env node

if (process.env.CI) {
    process.exit();
}

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { hasAnyDep } = require("./utils");

const writeFileAsync = promisify(fs.writeFile);

// get the path to the host project.
const projectPath = path.resolve(process.cwd(), "..", "..", "..");

console.log("Configuring @anolilab/eslint-config", projectPath, "\n");

/**
 * Writes .prettierrc.js if it doesn't exist. Warns if it exists.
 */
const writePrettierRc = () => {
    const prettierPath = path.join(projectPath, ".prettierrc.js");
    const content = require("../index")

    if (fs.existsSync(prettierPath) || fs.existsSync(prettierPath.replace('.js', ''))) {
        console.warn(`⚠️  .prettierrc.js already exists;
Make sure that it includes the following for @anolilab/eslint-config to work as it should:
${JSON.stringify(content, null, 4)}\n`);

        return Promise.resolve();
    }

    return writeFileAsync(
        prettierPath,
        `module.exports = ${JSON.stringify(content, null, 2)}\n`,
        "utf-8",
    );
};

/**
 * Writes .prettierignore if it doesn't exist. Warns if it exists.
 */
const writePrettierIgnore = () => {
    const prettierPath = path.join(projectPath, ".prettierignore");

    if (fs.existsSync(prettierPath)) {
        console.warn(`⚠️  .prettierignore already exists`);

        return Promise.resolve();
    }

    return writeFileAsync(prettierPath, "", "utf-8");
};

(async () => {
    try {
        await Promise.all([writePrettierRc(), writePrettierIgnore()]);

        console.log("😎  Everything went well, have fun!");

        process.exit();
    } catch (err) {
        console.log("😬  something went wrong:");
        console.error(err.message);

        process.exit(1);
    }
})();
