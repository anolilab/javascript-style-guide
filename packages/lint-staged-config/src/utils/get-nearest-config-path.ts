import { dirname, join } from "node:path";

import { findUpSync, isAccessibleSync } from "@visulima/fs";
import type { Join } from "type-fest";

import type { AbsolutePath, ConfigPath } from "../types";

const packageDirectorySync = (cwd?: string) => {
    const filePath = findUpSync("package.json", { cwd });

    return filePath && dirname(filePath);
};

/**
 * Narrows a string to an absolute path.
 *
 * `startsWith` does not narrow a `string` to the `` `/${string}` `` template literal type on its
 * own, so the check is expressed as a predicate rather than asserted away at each call site.
 * @param value Any path-like string.
 * @returns True when the path is absolute.
 */
const isAbsolutePath = (value: string): value is AbsolutePath => value.startsWith("/");

const getNearestPackageRootPath = (cwd?: string): AbsolutePath => {
    const packageDirectoryPath = packageDirectorySync(cwd ?? process.cwd());

    if (packageDirectoryPath !== undefined && isAbsolutePath(packageDirectoryPath)) {
        return packageDirectoryPath;
    }

    throw new Error(`Cannot determine the nearest root of the package for the file: ${cwd ?? "unknown"}!`);
};

const joinPaths = <T extends ReadonlyArray<string>>(paths: T): Join<T, "/"> => {
    const joined = join(...paths);

    if (isAbsolutePath(joined)) {
        // `Join` collapses to a template literal type the checker cannot derive from `path.join`.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- see comment above
        return joined as Join<T, "/">;
    }

    throw new TypeError(`Joined path did not return an absolute path.`);
};

const getNearestConfigPath = <N extends string = string, A extends AbsolutePath = AbsolutePath>(fileName: N, cwd?: A): ConfigPath<A, N> => {
    const packageRootPath = getNearestPackageRootPath(cwd);

    // The package root is an ancestor of `cwd`, so it cannot be proven to be the same `A`. The
    // generic overstates what this function knows; narrowing it would change the public signature.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- see comment above
    const configPath = joinPaths<[A, N]>([packageRootPath as A, fileName]);

    if (isAccessibleSync(configPath)) {
        return configPath;
    }

    throw new Error(`Cannot locate nearest "${fileName}" file!`);
};

export { isAbsolutePath };
export default getNearestConfigPath;
