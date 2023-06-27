import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

if (process.env["CI"]) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/lint-staged-config", projectPath, "\n");

const configFile = ".lintstagedrc";

/**
 * Writes .lintstagedrc.js if it doesn't exist. Warns if it exists.
 */
const writeLintstagedRc = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const filename of [
        configFile,
        `${configFile}.js`,
        `${configFile}.cjs`,
        `${configFile}.mjs`,
        `${configFile}.json`,
        `${configFile}.yaml`,
        `${configFile}.yml`,
        "lint-staged.config.js",
        "lint-staged.config.mjs",
        "lint-staged.config.cjs",
    ]) {
        if (existsSync(join(projectPath, filename))) {
            console.warn(`⚠️  ${filename} already exists;`);

            return Promise.resolve();
        }
    }

    const lintstagedPath = join(projectPath, ".lintstagedrc.js");

    const content = `${packageIsTypeModule ? 'import config from "@anolilab/lint-staged-config"' : 'const config = require("@anolilab/lint-staged-config")'};

${packageIsTypeModule ? "export default" : "module.exports ="} {
    ...config,
};
`;

    return writeFileAsync(lintstagedPath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        await writeLintstagedRc();
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
