import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const checkIfFileExists = (filename: string): boolean => {
    if (existsSync(filename)) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ ${filename} already exists;`);

        return true;
    }

    return false;
};

/**
 * Writes commitlint.config.js if it doesn't exist. Warns if it exists.
 */
const writeCommitLintConfig = async (cwd: string, isTypeModule: boolean) => {
    const configFile = "commitlint";

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
        if (checkIfFileExists(join(cwd, filename))) {
            // eslint-disable-next-line no-console
            console.warn(`⚠️  ${filename} already exists;`);

            return;
        }
    }

    const filePath = join(cwd, "commitlint.config.js");

    const content = `${isTypeModule ? "export default" : "module.exports ="} {
    extends: ["@anolilab/commitlint-config"],
    rules: {
        // overwrite rules here
        // or extend rules
    },
};

`;

    await writeFile(filePath, content, "utf8");
};

/**
 * Writes .czrc if it doesn't exist. Warns if it exists.
 */
const writeCzrc = async (cwd: string) => {
    const filePath = join(cwd, ".czrc");

    if (existsSync(filePath)) {
        // eslint-disable-next-line no-console
        console.warn("⚠️  .czrc already exists;");

        return;
    }

    const content = `{
  "path": "cz-conventional-changelog"
}

`;

    await writeFile(filePath, content, "utf8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    const cwd = process.cwd();

    const packageJsonPath = join(cwd, "package.json");

    if (!existsSync(packageJsonPath)) {
        // eslint-disable-next-line no-console
        console.error("No package.json found in the current directory. You need to run this command in a directory with a package.json file.");

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }

    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as { type?: string };

    // eslint-disable-next-line no-console
    console.log("Configuring @anolilab/commitlint-config", cwd, "\n");

    try {
        await writeCommitLintConfig(cwd, packageJson.type === "module");
        await writeCzrc(cwd);

        // eslint-disable-next-line no-console
        console.log("Everything went well, have fun!");

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Something went wrong:", error);

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }
})();
