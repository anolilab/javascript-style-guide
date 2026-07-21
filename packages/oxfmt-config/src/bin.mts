import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { exit } from "node:process";

import content from ".";

// oxfmt only auto-discovers these config file names, so both the "already configured" check and
// the file we write must use one of them. `oxfmt.config.js`/`.mjs`/`.cjs` are NOT auto-discovered
// (they only work when passed explicitly via `-c`), so we write `oxfmt.config.ts`, which oxfmt
// parses natively and which can import this package.
const AUTO_DISCOVERED_CONFIG_FILES = [".oxfmtrc.json", ".oxfmtrc.jsonc", "oxfmt.config.ts", "oxfmt.config.mts"];

/**
 * Writes `oxfmt.config.ts` if no oxfmt config exists yet. Warns when one is already present.
 */
const writeOxfmtConfig = async (cwd: string) => {
    for (const filename of AUTO_DISCOVERED_CONFIG_FILES) {
        if (existsSync(join(cwd, filename))) {
            // eslint-disable-next-line no-console
            console.warn(`⚠️  ${filename} already exists;
Make sure that it includes the following for @anolilab/oxfmt-config to work as it should:
${JSON.stringify(content, undefined, 4)}\n`);

            return;
        }
    }

    await writeFile(
        join(cwd, "oxfmt.config.ts"),
        `import config from "@anolilab/oxfmt-config";

export default config;
`,
        "utf8",
    );
};

const cwd = process.cwd();

if (!existsSync(join(cwd, "package.json"))) {
    // eslint-disable-next-line no-console
    console.error("No package.json found in the current directory. You need to run this command in a directory with a package.json file.");

    exit(1);
}

// eslint-disable-next-line no-console
console.log("Configuring @anolilab/oxfmt-config", cwd, "\n");

try {
    await writeOxfmtConfig(cwd);

    // eslint-disable-next-line no-console
    console.log("Everything went well, have fun!");

    exit(0);
} catch (error) {
    // eslint-disable-next-line no-console
    console.error("Something went wrong:", error);

    exit(1);
}
