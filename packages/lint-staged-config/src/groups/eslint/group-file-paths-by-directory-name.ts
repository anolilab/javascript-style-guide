import { dirname } from "node:path";

const groupFilePathsByDirectoryName = (filePaths: string[]): { [key: string]: string[] } => {
    const groups: { [key: string]: string[] } = {};

    filePaths.forEach((filePath) => {
        const directoryName = dirname(filePath);

        // eslint-disable-next-line security/detect-object-injection
        if (!groups[directoryName]) {
            // eslint-disable-next-line security/detect-object-injection
            groups[directoryName] = [];
        }
        // eslint-disable-next-line security/detect-object-injection
        (groups[directoryName] as string[]).push(filePath);
    });

    return groups;
};

export default groupFilePathsByDirectoryName;
