import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { exit } from "node:process";

import content from ".";

const configFile = ".oxfmtrc";

/**
 * Writes an oxfmt config file if none exists. Warns when one is already present.
 */
const writeOxfmtConfig = async (cwd: string, isTypeModule: boolean) => {
    for (const filename of [
        `${configFile}.json`,
        `${configFile}.jsonc`,
        "oxfmt.config.js",
        "oxfmt.config.mjs",
        "oxfmt.config.cjs",
        "oxfmt.config.ts",
        "oxfmt.config.mts",
        "oxfmt.config.cts",
    ]) {
        if (existsSync(join(cwd, filename))) {
            // eslint-disable-next-line no-console
            console.warn(`⚠️  ${filename} already exists;
Make sure that it includes the following for @anolilab/oxfmt-config to work as it should:
${JSON.stringify(content, undefined, 4)}\n`);

            return;
        }
    }

    const oxfmtPath = join(cwd, "oxfmt.config.js");

    const importLine = isTypeModule ? `import config from "@anolilab/oxfmt-config";` : `const config = require("@anolilab/oxfmt-config");`;
    const exportLine = isTypeModule ? "export default" : "module.exports =";

    await writeFile(
        oxfmtPath,
        `${importLine}

${exportLine} {
    ...config,
};
`,
        "utf8",
    );
};

// The bin is built to both ESM and CJS, and CJS cannot use top-level await, so the async work
// runs in an IIFE. prefer-top-level-await is turned off for this file in eslint.config.js.
// eslint-disable-next-line no-void
void (async () => {
    const cwd = process.cwd();

    const packageJsonPath = join(cwd, "package.json");

    if (!existsSync(packageJsonPath)) {
        // eslint-disable-next-line no-console
        console.error("No package.json found in the current directory. You need to run this command in a directory with a package.json file.");

        exit(1);
    }

    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as { type?: string };

    // eslint-disable-next-line no-console
    console.log("Configuring @anolilab/oxfmt-config", cwd, "\n");

    try {
        await writeOxfmtConfig(cwd, packageJson.type === "module");

        // eslint-disable-next-line no-console
        console.log("Everything went well, have fun!");

        exit(0);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Something went wrong:", error);

        exit(1);
    }
})();
