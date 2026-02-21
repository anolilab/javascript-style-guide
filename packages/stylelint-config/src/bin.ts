import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { exit } from "node:process";

const file = ".stylelintrc";

/**
 * Writes .stylelintrc.cjs if it doesn't exist. Warns if it exists.
 */
const writeStylelintRc = async (cwd: string, isTypeModule: boolean) => {
    for (const filename of [file, `${file}.js`, `${file}.cjs`, `${file}.json`, `${file}.yaml`, `${file}.yml`, `stylelint.config.js`, `stylelint.config.cjs`]) {
        if (existsSync(join(cwd, filename))) {
            // eslint-disable-next-line no-console
            console.warn(
                "⚠️  .stylelintrc.js already exists; Make sure that it includes the following for @anolilab/stylelint-config to work as it should: { \"extends\": [\"@anolilab/stylelint-config\"] }.",
            );

            return;
        }
    }

    const stylelintPath = join(cwd, ".stylelintrc.js");
    const content = `${isTypeModule ? "export default" : "module.exports ="} {
    "extends": [
        "@anolilab/stylelint-config",
    ]
};

`;

    await writeFile(stylelintPath, content, "utf8");
};

/**
 * Writes .stylelintignore if it doesn't exist. Warns if it exists.
 */
const writeStylelintIgnore = async (cwd: string) => {
    const stylelintIgnorePath = join(cwd, ".stylelintignore");
    const content = `package.json
package-lock.json
yarn.lock
pnpm-lock.yaml
build/**
node_modules/**
.next/**
dist/**

`;

    if (existsSync(stylelintIgnorePath)) {
        return;
    }

    await writeFile(stylelintIgnorePath, content, "utf8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    const cwd = process.cwd();

    const packageJsonPath = join(cwd, "package.json");

    if (!existsSync(packageJsonPath)) {
        // eslint-disable-next-line no-console
        console.error("😬  No package.json found in the current directory. You need to run this command in a directory with a package.json file.");

        exit(1);
    }

    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as { type?: string };

    // eslint-disable-next-line no-console
    console.log("Configuring @anolilab/stylelint-config", cwd, "\n");

    try {
        await writeStylelintRc(cwd, packageJson?.type === "module");
        await writeStylelintIgnore(cwd);

        // eslint-disable-next-line no-console
        console.log("😎  Everything went well, have fun!");

        exit(0);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log("😬  something went wrong:");
        // eslint-disable-next-line no-console
        console.error(error);

        exit(1);
    }
})();
