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

/**
 * Writes .stylelintrc.cjs if it doesn't exist. Warns if it exists.
 */
const writeStylelintRc = () => {
    const stylelintPath = join(projectPath, ".stylelintrc.js");
    const content = `${packageIsTypeModule ? "export default" : "module.exports ="} {
    "extends": [
        "@anolilab/stylelint-config",
    ]
};

`;

    if (existsSync(stylelintPath)) {
        console.warn(
            '⚠️  .stylelintrc.js already exists; Make sure that it includes the following for @anolilab/stylelint-config to work as it should: { "extends": ["@anolilab/stylelint-config"] }.',
        );

        return Promise.resolve();
    }

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
