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
const writeCommitLintConfig = () => {
    const commitlintPath = join(projectPath, "commitlint.config.js");

    if (existsSync(commitlintPath)) {
        console.warn("⚠️  commitlint.config.js already exists;");

        return Promise.resolve();
    }

    const content = `${packageIsTypeModule ? "export default" : "module.exports ="} {
    extends: ["@commitlint/config-conventional"],
};

`;

    return writeFileAsync(commitlintPath, content, "utf-8");
};

/**
 * Writes .czrc if it doesn't exist. Warns if it exists.
 */
const writeCzrc = () => {
    const filePath = join(projectPath, ".czrc");

    if (existsSync(filePath)) {
        console.warn("⚠️  .czrc already exists;");

        return Promise.resolve();
    }

    const content = `{
  "path": "cz-conventional-changelog"
}

`;

    return writeFileAsync(filePath, content, "utf-8");
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
