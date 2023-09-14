import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { env, exit } from "node:process";
import { promisify } from "node:util";

import { hasDependencies, hasDevDependencies, pkg, projectPath } from "@anolilab/package-json-utils";

if (env["CI"]) {
    exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/semantic-release-preset", projectPath, "\n");

/**
 * Writes .releaserc.json if it doesn't exist. Warns if it exists.
 */
const writeReleaseRc = async () => {
    if (
        pkg &&
        (hasDevDependencies(["multi-semantic-release", "@qiwi/multi-semantic-release"]) ||
            hasDependencies(["multi-semantic-release", "@qiwi/multi-semantic-release"]))
    ) {
        console.warn("⚠️  found use of multi-semantic-release;");

        return;
    }

    const releaseRcPath = join(projectPath, ".releaserc.json");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(releaseRcPath)) {
        console.warn("⚠️  .releaserc.json already exists;");

        return;
    }

    const content = `{
    "extends": "@anolilab/semantic-release-preset/npm"
}

`;

    await writeFileAsync(releaseRcPath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        await writeReleaseRc();

        console.log("😎  Everything went well, have fun!");

        exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error);

        exit(1);
    }
})();
