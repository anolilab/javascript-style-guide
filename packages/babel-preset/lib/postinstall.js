#!/usr/bin/env node

if (process.env.CI) {
    process.exit();
}

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const writeFileAsync = promisify(fs.writeFile);

// get the path to the host project.
const projectPath = path.resolve(process.cwd(), "..", "..", "..");

console.log("Configuring @anolilab/babel-preset", projectPath, "\n");

/**
 * Writes .babelrc.js if it doesn't exist. Warns if it exists.
 */
const writeBabelRc = () => {
    const eslintPath = path.join(projectPath, ".babelrc.js");
    const content = `module.exports = {
    presets: ["@anolilab/babel-preset"]
};
`;

    if (fs.existsSync(eslintPath)) {
        console.warn(`⚠️  .babelrc.js already exists;
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

        process.exit();
    } catch (err) {
        console.log("😬  something went wrong:");
        console.error(err.message);

        process.exit(1);
    }
})();
