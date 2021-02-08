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

console.log("Configuring @anolilab/stylelint-config", projectPath, "\n");

/**
 * Writes .stylelintrc.js if it doesn't exist. Warns if it exists.
 */
const writeStylelintRc = () => {
    const eslintPath = path.join(projectPath, ".stylelintrc.js");
    const content = `module.exports = {
    "extends": [
        "@anolilab/stylelint-config",
    ]
};
`;

    if (fs.existsSync(eslintPath)) {
        console.warn(`⚠️  .stylelintrc.js already exists;
Make sure that it includes the following for @anolilab/stylelint-config'
to work as it should: { presets: ["@anolilab/stylelint-config"] }.`);

        return Promise.resolve();
    }

    return writeFileAsync(eslintPath, content, "utf-8");
};

(async () => {
    try {
        await writeStylelintRc();

        console.log("😎  Everything went well, have fun!");

        process.exit();
    } catch (err) {
        console.log("😬  something went wrong:");
        console.error(err.message);

        process.exit(1);
    }
})();
