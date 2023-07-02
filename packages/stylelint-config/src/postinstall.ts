import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

if (process.env["CI"]) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/stylelint-config", projectPath, "\n");

const file = ".stylelintrc";

/**
 * Writes .stylelintrc.cjs if it doesn't exist. Warns if it exists.
 */
const writeStylelintRc = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const filename of [file, `${file}.js`, `${file}.cjs`, `${file}.json`, `${file}.yaml`, `${file}.yml`, `stylelint.config.js`, `stylelint.config.cjs`]) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (existsSync(join(projectPath, filename))) {
            console.warn(
                '⚠️  .stylelintrc.js already exists; Make sure that it includes the following for @anolilab/stylelint-config to work as it should: { "extends": ["@anolilab/stylelint-config"] }.',
            );

            return Promise.resolve();
        }
    }

    const stylelintPath = join(projectPath, ".stylelintrc.js");
    const content = `${packageIsTypeModule ? "export default" : "module.exports ="} {
    "extends": [
        "@anolilab/stylelint-config",
    ]
};

`;

    return writeFileAsync(stylelintPath, content, "utf-8");
};

/**
 * Writes .stylelintignore if it doesn't exist. Warns if it exists.
 */
const writeStylelintIgnore = () => {
    const stylelintIgnorePath = join(projectPath, ".stylelintignore");
    const content = `package.json
package-lock.json
yarn.lock
pnpm-lock.yaml
build/**
node_modules/**
.next/**

`;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(stylelintIgnorePath)) {
        return Promise.resolve();
    }

    return writeFileAsync(stylelintIgnorePath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        await writeStylelintRc();
        await writeStylelintIgnore();

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
