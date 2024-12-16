import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";

if (process.env["CI"]) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/commitlint-config", projectPath, "\n");

const checkIfFileExists = (filename: string): boolean => {
    if (existsSync(filename)) {
        console.warn(`⚠️ ${filename} already exists;`);

        return true;
    }

    return false;
};

/**
 * Writes commitlint.config.js if it doesn't exist. Warns if it exists.
 */
const writeCommitLintConfig = async () => {
    const configFile = "commitlint";

    // eslint-disable-next-line no-restricted-syntax,no-loops/no-loops
    for (const filename of [
        configFile,
        `.${configFile}rc`,
        `.${configFile}.json`,
        `.${configFile}.yaml`,
        `.${configFile}.yml`,
        `.${configFile}.js`,
        `.${configFile}.cjs`,
        `.${configFile}.mjs`,
        `.${configFile}.ts`,
        `.${configFile}.cts`,
        `.${configFile}.config.js`,
        `.${configFile}.config.cjs`,
        `.${configFile}.config.mjs`,
        `.${configFile}.config.ts`,
        `.${configFile}.config.cts`,
    ]) {
        if (checkIfFileExists(join(projectPath, filename))) {
            console.warn(`⚠️  ${filename} already exists;`);

            return;
        }
    }

    const filePath = join(projectPath, "commitlint.config.js");

    const content = `${packageIsTypeModule ? "export default" : "module.exports ="} {
    extends: ["@anolilab/commitlint-config"],
    rules: {
        // overwrite rules here
        // or extend rules
    },
};

`;

    await writeFileAsync(filePath, content, "utf-8");
};

/**
 * Writes .czrc if it doesn't exist. Warns if it exists.
 */
const writeCzrc = async () => {
    const filePath = join(projectPath, ".czrc");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(filePath)) {
        console.warn("⚠️  .czrc already exists;");

        return;
    }

    const content = `{
  "path": "cz-conventional-changelog"
}

`;

    await writeFileAsync(filePath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        await writeCommitLintConfig();
        await writeCzrc();

        console.log("😎  Everything went well, have fun!");

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error);

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }
})();
