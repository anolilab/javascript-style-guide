import { dirname } from "node:path";

const groupFilePathsByDirectoryName = (filePaths: string[]): Record<string, string[]> => {
    const groups: Record<string, string[]> = {};

    filePaths.forEach((filePath) => {
        const directoryName = dirname(filePath);

        groups[directoryName] ??= [];

        groups[directoryName].push(filePath);
    });

    return groups;
};

export default groupFilePathsByDirectoryName;
