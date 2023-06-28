import findUp from "find-up";
import { existsSync } from "node:fs";
import { dirname,join } from "node:path";
import type { Join } from "type-fest";

const packageDirectorySync = (cwd?: string) => {
    const filePath = findUp.sync("package.json", { cwd });

    return filePath && dirname(filePath);
};

const getNearestPackageRootPath = (cwd?: string): AbsolutePath => {
    const packageDirectoryPath = packageDirectorySync(cwd ?? process.cwd());

    if (packageDirectoryPath?.startsWith("/")) {
        return packageDirectoryPath as AbsolutePath;
    }

    throw new Error(`Cannot determine the nearest root of the package for the file: ${cwd}!`);
};

const joinPaths = <T extends ReadonlyArray<string>>(paths: T): Join<T, "/"> => {
    const joined = join(...paths);

    if (joined.startsWith("/")) {
        return joined as Join<T, "/">;
    }

    throw new TypeError(`Joined path did not return an absolute path.`);
};

const getNearestConfigPath = <N extends ConfigFileName, A extends AbsolutePath = AbsolutePath>(fileName: N, cwd?: A): ConfigPath<A, N> => {
    const packageRootPath = getNearestPackageRootPath(cwd);
    const configPath = joinPaths<[A, N]>([packageRootPath as A, fileName]);

    if (existsSync(configPath)) {
        return configPath;
    }

    throw new Error(`Cannot locate nearest "${fileName}" file!`);
};

export type AbsolutePath = `/${string}`;
export type ConfigFileName = string;
export type ConfigPath<A extends AbsolutePath, N extends ConfigFileName> = Join<[A, N], "/">;

export default getNearestConfigPath;
