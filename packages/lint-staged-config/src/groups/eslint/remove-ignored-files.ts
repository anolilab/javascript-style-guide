import { ESLint } from "eslint";
import { quote } from "shell-quote";

import isWindows from "../../utils/is-windows";

const removeIgnoredFiles = async (filenames: string[]): Promise<string[]> => {
    const eslint = new ESLint();
    // eslint-disable-next-line compat/compat
    const promises = await Promise.allSettled(filenames.map(async (filename) => await eslint.isPathIgnored(filename)));
    const ignoredFiles = promises.map((promise) => {
        if (promise.status === "fulfilled") {
            return promise.value;
        }

        console.error(`\nUnable to determine if file is ignored.\n\n\n${promise.reason}`);

        throw new Error("Stopping lint-staged because of an error.");
    });

    // eslint-disable-next-line security/detect-object-injection
    const filteredFiles = filenames.filter((_, index) => !ignoredFiles[index]);

    return filteredFiles.map((filename) => `"${isWindows ? filename : quote([filename])}"`);
};

export default removeIgnoredFiles;
