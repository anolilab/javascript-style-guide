import { ESLint } from "eslint";
import { quote } from "shell-quote";

import isWindows from "../../utils/is-windows";

const removeIgnoredFiles = async (filenames: string[]): Promise<string[]> => {
    const eslint = new ESLint();
    // eslint-disable-next-line compat/compat
    const ignoredFiles = await Promise.all(filenames.map(async (filename) => await eslint.isPathIgnored(filename)));
    // eslint-disable-next-line security/detect-object-injection
    const filteredFiles = filenames.filter((_, index) => !ignoredFiles[index]);

    return filteredFiles.map((filename) => `"${isWindows ? filename : quote([filename])}"`);
};

export default removeIgnoredFiles;
