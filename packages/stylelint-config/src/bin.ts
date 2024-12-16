import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { exit } from "node:process";

const file = ".stylelintrc";

/**
 * Writes .stylelintrc.cjs if it doesn't exist. Warns if it exists.
 */
const writeStylelintRc = async (cwd: string, isTypeModule: boolean) => {
    // eslint-disable-next-line no-restricted-syntax,no-loops/no-loops
    for (const filename of [file, `${file}.js`, `${file}.cjs`, `${file}.json`, `${file}.yaml`, `${file}.yml`, `stylelint.config.js`, `stylelint.config.cjs`]) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (existsSync(join(cwd, filename))) {
            console.warn(
                '⚠️  .stylelintrc.js already exists; Make sure that it includes the following for @anolilab/stylelint-config to work as it should: { "extends": ["@anolilab/stylelint-config"] }.',
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

    await writeFile(stylelintPath, content, "utf-8");
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
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(stylelintIgnorePath)) {
        return;
    }

    await writeFile(stylelintIgnorePath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    const cwd = process.cwd();

    const packageJsonPath = join(cwd, "package.json");

    if (!existsSync(packageJsonPath)) {
        console.error("😬  No package.json found in the current directory. You need to run this command in a directory with a package.json file.");

        exit(1);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));

    console.log("Configuring @anolilab/stylelint-config", cwd, "\n");

    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await writeStylelintRc(cwd, packageJson?.type === "module");
        await writeStylelintIgnore(cwd);

        console.log("😎  Everything went well, have fun!");

        exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error);

        exit(1);
    }
})();
