import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

import { projectPath } from "@anolilab/package-json-utils";

const writeFileAsync = promisify(writeFile);

const writeEslintIgnore = async (): Promise<void> => {
    const eslintIgnorePath = join(projectPath, ".eslintignore");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(eslintIgnorePath)) {
        console.warn("⚠️  .eslintignore already exists");

        return;
    }

    await writeFileAsync(eslintIgnorePath, "", "utf8");
};

export default writeEslintIgnore;
