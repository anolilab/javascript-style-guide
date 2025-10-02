import { existsSync } from "node:fs";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { exit } from "node:process";

import content from ".";

const configFile = ".prettierrc";

/**
 * Writes .prettierrc.${m|c}js if it doesn't exist. Warns if it exists.
 */
const writePrettierRc = async (cwd: string, isTypeModule: boolean) => {
    // eslint-disable-next-line no-restricted-syntax,no-loops/no-loops
    for (const filename of [
        configFile,
        `${configFile}.js`,
        `${configFile}.cjs`,
        `${configFile}.mjs`,
        `${configFile}.json`,
        `${configFile}.json5`,
        `${configFile}.yaml`,
        `${configFile}.yml`,
        `${configFile}.toml`,
        "prettier.config.js",
        "prettier.config.mjs",
        "prettier.config.cjs",
    ]) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (existsSync(join(cwd, filename))) {
            console.warn(`⚠️  ${filename} already exists;
Make sure that it includes the following for @anolilab/prettier-config to work as it should:
${JSON.stringify(content, undefined, 4)}\n`);

            return;
        }
    }

    const prettierPath = join(cwd, ".prettierrc.js");

    await writeFile(
        prettierPath,
        `${isTypeModule ? 'import config from "@anolilab/prettier-config";' : 'var config = require("@anolilab/prettier-config");'}

${isTypeModule ? "export default" : "module.exports ="} {
    ...config,
}
`,
        "utf8",
    );
};

/**
 * Writes .prettierignore if it doesn't exist. Warns if it exists.
 */
const writePrettierIgnore = async (cwd: string) => {
    const prettierPath = join(cwd, ".prettierignore");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(prettierPath)) {
        console.warn("⚠️  .prettierignore already exists");

        return;
    }

    await writeFile(
        prettierPath,
        `${["*.md", "*.sh", "*.yml", "*.svg", "*.gif", "*.log", ".DS_Store", "CNAME", "AUTHORS", "LICENSE", "es/", "lib/", "dist/", "coverage/"].join("\n")}\n`,
        "utf8",
    );
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    const cwd = process.cwd();

    const packageJsonPath = join(cwd, "package.json");

    if (!existsSync(packageJsonPath)) {
        console.error(
            "No package.json found in the current directory. You need to run this command in a directory with a package.json file.",
        );

        exit(1);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));

    console.log("Configuring @anolilab/prettier-config", cwd, "\n");

    try {
        await writePrettierRc(cwd, packageJson.type === "module");
        await writePrettierIgnore(cwd);

        console.log("Everything went well, have fun!");

        exit(0);
    } catch (error) {
        console.error("Something went wrong:", error);

        exit(1);
    }
})();
