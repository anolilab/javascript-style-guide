import { dirname } from "node:path";

const groupFilePathsByDirectoryName = (filePaths: string[]): { [key: string]: string[] } => {
    const groups: { [key: string]: string[] } = {};

    filePaths.forEach((filePath) => {
        const directoryName = dirname(filePath);

        if (!groups[directoryName]) {
            groups[directoryName] = [];
        }

        (groups[directoryName] as string[]).push(filePath);
    });

    return groups;
};

export default groupFilePathsByDirectoryName;
