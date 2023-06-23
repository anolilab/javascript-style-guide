import {
 hasDep, hasDevelopmentDep, pkg, projectPath
} from "@anolilab/package-json-utils";
import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

if (process.env["CI"]) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/semantic-release-preset", projectPath, "\n");

/**
 * Writes .releaserc.json if it doesn't exist. Warns if it exists.
 */
const writeReleaseRc = () => {
    if (
        pkg
        && (hasDevelopmentDep(["multi-semantic-release", "@qiwi/multi-semantic-release"]) || hasDep(["multi-semantic-release", "@qiwi/multi-semantic-release"]))
    ) {
        console.warn("⚠️  found use of multi-semantic-release;");

        return Promise.resolve();
    }

    const releaseRcPath = join(projectPath, ".releaserc.json");

    if (existsSync(releaseRcPath)) {
        console.warn("⚠️  .releaserc.json already exists;");

        return Promise.resolve();
    }

    const content = `{
    "extends": "@anolilab/semantic-release-preset/npm"
}

`;

    return writeFileAsync(releaseRcPath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        await writeReleaseRc();

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
