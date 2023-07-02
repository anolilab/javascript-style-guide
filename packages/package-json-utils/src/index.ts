import { getByPath } from "dot-path-value";
import { existsSync, realpathSync } from "node:fs";
import module from "node:module";
import { dirname, join } from "node:path";
import { cwd, env, exit, versions } from "node:process";
import type { NormalizedPackageJson } from "read-pkg";
import readPkgUp from "read-pkg-up";

const { packageJson, path: packagePath } = readPkgUp.sync({
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    cwd: realpathSync(cwd()),
}) ?? { packageJson: undefined, path: undefined };

const atLatest = (name: string): string => {
    if (!name.split("@").includes("@")) {
        return `${name}@latest`;
    }

    return name;
};

export const getPackageProperty = <T = unknown>(property: string): T | undefined => {
    if (packageJson === undefined) {
        return undefined;
    }

    return getByPath(packageJson, property) as T | undefined;
};

export const getPackageSubProperty =
    <T = unknown>(packageProperty: string) =>
    (property: string): T | undefined =>
        getPackageProperty<T>(`${packageProperty}.${property}`);

export const hasPackageProperty = (property: string): boolean => Boolean(packageJson !== undefined && getByPath(packageJson, property));

export const hasPackageSubProperty =
    (packageProperty: string) =>
    (property: string): boolean =>
        hasPackageProperty(`${packageProperty}.${property}`);

export const hasPackageProperties = (properties: string[], strict?: boolean): boolean => {
    if (strict) {
        return properties.every((property: string) => hasPackageProperty(property));
    }

    return properties.some((property: string) => hasPackageProperty(property));
};

export const hasPackageSubProperties =
    (packageProperty: string) =>
    (properties: string[], strict?: boolean): boolean =>
        hasPackageProperties(
            properties.map((p) => `${packageProperty}.${p}`),
            strict,
        );

// eslint-disable-next-line security/detect-object-injection
export const environmentIsSet = (name: string): boolean => Boolean(env[name] && env[name] !== "undefined");

export const parseEnvironment = (name: string, defaultValue: unknown): any => {
    if (environmentIsSet(name)) {
        try {
            // eslint-disable-next-line security/detect-object-injection
            return JSON.parse(env[name] ?? "");
        } catch {
            // eslint-disable-next-line security/detect-object-injection
            return env[name];
        }
    }

    return defaultValue;
};

export const projectPath: string = packagePath ? dirname(packagePath) : "";
// @deprecated Use `projectPath` instead.
export const appDirectory: string = projectPath;
export const fromRoot = (...p: string[]): string => join(projectPath, ...p);
// eslint-disable-next-line security/detect-non-literal-fs-filename
export const hasFile = (...p: string[]): boolean => existsSync(fromRoot(...p));

export const hasScripts = hasPackageSubProperties("scripts");
export const hasPeerDependency = hasPackageSubProperty("peerDependencies");
export const hasPeerDependencies = hasPackageSubProperties("peerDependencies");
// @deprecated Use `hasPeerDependencies` instead.
export const hasPeerDep = hasPeerDependencies;
export const hasDependency = hasPackageSubProperty("dependencies");
export const hasDependencies = hasPackageSubProperties("dependencies");
// @deprecated Use `hasDependencies` instead.
export const hasDep = hasDependencies;
// eslint-disable-next-line unicorn/prevent-abbreviations
export const hasDevDependency = hasPackageSubProperty("devDependencies");
// eslint-disable-next-line unicorn/prevent-abbreviations
export const hasDevDependencies = hasPackageSubProperties("devDependencies");
// @deprecated Use `hasDevDependencies` instead.
export const hasDevelopmentDep = hasDevDependencies;

export const hasAnyDep = (arguments_: string[], options?: { peerDeps?: boolean; strict?: boolean }): boolean =>
    [hasDependencies, hasDevDependencies, options?.peerDeps === false ? () => false : hasPeerDependencies].some(
        (function_: (arguments_: string[], strict?: boolean) => boolean) => function_(arguments_, options?.strict),
    );

export const hasTypescript: boolean = (hasDependency("typescript") || hasDevDependency("typescript")) && hasFile("tsconfig.json");

export const packageIsTypeModule = hasPackageProperties(["type"]) && packageJson?.["type"] === "module";

export const resolvePackage = (packageName: string): string | undefined => {
    // See https://yarnpkg.com/advanced/pnpapi
    if (versions["pnp"]) {
        const targetModule = import.meta.url;
        // @ts-expect-error TS2339: Property 'findPnpApi' does not exist on type 'typeof Module'.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const targetPnp = module.findPnpApi(targetModule);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        const resolved = targetPnp.resolveRequest(packageName, targetModule);

        if (resolved) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return resolved;
        }
    } else if (packageIsTypeModule) {
        const targetModule = import.meta.url;
        // See https://nodejs.org/api/esm.html#esm_resolver_algorithm
        try {
            return module.createRequire(targetModule).resolve(packageName);
        } catch {
            return undefined;
        }
    }

    try {
        return require.resolve(packageName);
    } catch {
        return undefined;
    }
};

export const isPackageAvailable = (packageName: string): boolean => {
    const resolved = resolvePackage(packageName);

    return resolved !== undefined;
};

export const showMissingPackages = (
    packageName: string,
    packages: string[],
    options: {
        consoleType?: "error" | "info" | "log" | "warn";
        exit?: boolean;
        postMessage?: string;
        preMessage?: string;
    } = {},
): void => {
    const s = packages.length === 1 ? "" : "s";

    console[options.consoleType ?? "warn"](`\n${options.preMessage ?? ""}
${packageName} could not find the following package${s}

  ${packages.join("\n  ")}

To install the missing package${s}, please run the following command:

  npm install ${packages.map((element) => atLatest(element)).join(" ")} --save-dev

or

  yarn add ${packages.map((element) => atLatest(element)).join(" ")} --dev

or

  pnpm add ${packages.map((element) => atLatest(element)).join(" ")} -D
${options.postMessage ?? ""}\n
`);

    if (env["NODE_ENV"] !== "test" || options.exit === true) {
        exit(1);
    }
};

export const unique = (array: unknown[]): unknown[] => [...new Set(array)];

// eslint-disable-next-line unicorn/prevent-abbreviations
export const pkg = packageJson as NormalizedPackageJson | undefined;
