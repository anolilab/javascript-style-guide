import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

if (process.env["CI"]) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/babel-preset", projectPath, "\n");

/**
 * Writes babel.config.{c|m}js if it doesn't exist. Warns if it exists.
 */
const writeBabelRc = () => {
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

        return Promise.resolve();
    }

    return writeFileAsync(babelPath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async (): Promise<void> => {
    try {
        await writeBabelRc();

        console.log("😎  Everything went well, have fun!");

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0);
    } catch (error: any) {
        console.log("😬  something went wrong:");
        console.error(error);

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }
})();
