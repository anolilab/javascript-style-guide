#!/usr/bin/env node

if (process.env?.["CI"]) {
    // eslint-disable-next-line no-undef
    process.exit(0);
}

import { writeFile, existsSync } from "node:fs";
// eslint-disable-next-line unicorn/import-style
import { resolve, join } from "node:path";
import { promisify } from "node:util";
import { pkgIsTypeModule } from "@anolilab/package-json-utils";

const writeFileAsync = promisify(writeFile);

// get the path to the host project.
// eslint-disable-next-line no-undef
const projectPath = resolve(process.cwd(), "..", "..", "..");

console.log("Configuring @anolilab/babel-preset", projectPath, "\n");

/**
 * Writes babel.config.{c|m}js if it doesn't exist. Warns if it exists.
 */
const writeBabelRc = () => {
    const babelPath = join(projectPath, `babel.config.${pkgIsTypeModule ? "m" : "c"}js`);
    const content = `${pkgIsTypeModule ? "export default" : "module.exports ="} {
    presets: ["@anolilab/babel-preset"]
};
`;

    if (existsSync(babelPath)) {
        console.warn(`⚠️  babel.config.${pkgIsTypeModule ? "m" : "c"}js already exists;
Make sure that it includes the following for @anolilab/babel-preset'
to work as it should: { presets: ["@anolilab/babel-preset"] }.`);

        return Promise.resolve();
    }

    return writeFileAsync(babelPath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async (): Promise<void> => {
    try {
        await writeBabelRc();

        console.log("😎  Everything went well, have fun!");

        // eslint-disable-next-line no-undef
        process.exit(0);
    } catch (error: any) {
        console.log("😬  something went wrong:");
        console.error(error.message);

        // eslint-disable-next-line no-undef
        process.exit(1);
    }
})();
