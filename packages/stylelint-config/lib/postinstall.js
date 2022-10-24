#!/usr/bin/env node

import { existsSync, writeFile } from "node:fs";
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

console.log("Configuring @anolilab/stylelint-config", projectPath, "\n");

/**
 * Writes .stylelintrc.cjs if it doesn't exist. Warns if it exists.
 */
const writeStylelintRc = () => {
    const eslintPath = join(projectPath, ".stylelintrc.cjs");
    const content = `module.exports = {
    "extends": [
        "@anolilab/stylelint-config",
    ]
};
`;

    if (existsSync(eslintPath)) {
        console.warn("⚠️  .stylelintrc.cjs already exists; Make sure that it includes the following for @anolilab/stylelint-config to work as it should: { \"extends\": [\"@anolilab/stylelint-config\"] }.");

        return Promise.resolve();
    }

    return writeFileAsync(eslintPath, content, "utf-8");
};

/**
 * Writes .stylelintignore if it doesn't exist. Warns if it exists.
 */
const writeStylelintIgnore = () => {
    const eslintPath = join(projectPath, ".stylelintignore");
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

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        await writeStylelintRc();
        await writeStylelintIgnore();

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
