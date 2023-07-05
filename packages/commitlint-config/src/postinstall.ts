import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

if (process.env["CI"]) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/commitlint-config", projectPath, "\n");

/**
 * Writes commitlint.config.js if it doesn't exist. Warns if it exists.
 */
const writeCommitLintConfig = async () => {
    const commitlintPath = join(projectPath, "commitlint.config.js");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(commitlintPath)) {
        console.warn("⚠️  commitlint.config.js already exists;");

        return;
    }

    const content = `${packageIsTypeModule ? "export default" : "module.exports ="} {
    extends: ["@anolilab/commitlint-config"],
    rules: {
        // overwrite rules here
        // or extend rules
    },
};

`;

    await writeFileAsync(commitlintPath, content, "utf-8");
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
