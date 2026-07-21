import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { exit } from "node:process";

const extendsPath = "./node_modules/@anolilab/oxlint-config/.oxlintrc.json";

/**
 * Writes a `.oxlintrc.json` that extends this package if none exists. Warns when one is present.
 */
const writeOxlintConfig = async (cwd: string) => {
    for (const filename of [".oxlintrc.json", ".oxlintrc.jsonc", "oxlint.config.ts", "oxlint.config.mts", "oxlint.config.cts"]) {
        if (existsSync(join(cwd, filename))) {
            // eslint-disable-next-line no-console
            console.warn(`⚠️  ${filename} already exists;
Make sure that it extends @anolilab/oxlint-config for it to work as it should:
${JSON.stringify({ extends: [extendsPath] }, undefined, 4)}\n`);

            return;
        }
    }

    const oxlintPath = join(cwd, ".oxlintrc.json");

    await writeFile(
        oxlintPath,
        `${JSON.stringify(
            {
                $schema: "./node_modules/oxlint/configuration_schema.json",
                extends: [extendsPath],
                rules: {},
            },
            undefined,
            4,
        )}\n`,
        "utf8",
    );
};

const cwd = process.cwd();

const packageJsonPath = join(cwd, "package.json");

if (!existsSync(packageJsonPath)) {
    // eslint-disable-next-line no-console
    console.error("No package.json found in the current directory. You need to run this command in a directory with a package.json file.");

    exit(1);
}

// eslint-disable-next-line no-console
console.log("Configuring @anolilab/oxlint-config", cwd, "\n");

try {
    await writeOxlintConfig(cwd);

    // eslint-disable-next-line no-console
    console.log("Everything went well, have fun!");

    exit(0);
} catch (error) {
    // eslint-disable-next-line no-console
    console.error("Something went wrong:", error);

    exit(1);
}
