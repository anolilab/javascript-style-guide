import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { env, exit } from "node:process";
import { promisify } from "node:util";

import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";

if (env["CI"]) {
    exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/babel-preset", projectPath, "\n");

/**
 * Writes babel.config.{c|m}js if it doesn't exist. Warns if it exists.
 */
const writeBabelRc = async () => {
    const babelPath = join(projectPath, "babel.config.js");
    const content = `${packageIsTypeModule ? "export default" : "module.exports ="} {
    presets: ["@anolilab/babel-preset"]
};
`;

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(babelPath)) {
        console.warn(`⚠️  babel.config.js already exists;
Make sure that it includes the following for @anolilab/babel-preset'
to work as it should: { presets: ["@anolilab/babel-preset"] }.`);

        return;
    }

    await writeFileAsync(babelPath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async (): Promise<void> => {
    try {
        await writeBabelRc();

        console.log("😎  Everything went well, have fun!");

        exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error);

        exit(1);
    }
})();
