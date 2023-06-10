import { getByPath } from "dot-path-value";
import { existsSync, realpathSync } from "node:fs";
import module from "node:module";
import { dirname, join } from "node:path";
import readPkgUp from "read-pkg-up";

const { packageJson, path: packagePath } = readPkgUp.sync({
    cwd: realpathSync(process.cwd()),
}) ?? { packageJson: undefined, path: undefined };

const atLatest = (name: string): string => {
    if (!name.split("@").includes("@")) {
        return `${name}@latest`;
    }

    return name;
};

// eslint-disable-next-line max-len
export const hasPackageProperties = (properties: string[]): boolean => properties.some((property: string) => Boolean(packageJson !== undefined && getByPath(packageJson, property)));

export const hasPackageSubProperties = (packageProperty: string) => (properties: string[]): boolean => hasPackageProperties(properties.map((p) => `${packageProperty}.${p}`));

export const environmentIsSet = (name: string): boolean => Boolean(process.env[name] && process.env[name] !== "undefined");

export const parseEnvironment = (name: string, defaultValue: unknown): any => {
    if (environmentIsSet(name)) {
        try {
            return JSON.parse(process.env[name] ?? "");
        } catch {
            return process.env[name];
        }
    }

    return defaultValue;
};

export const appDirectory: string = packagePath ? dirname(packagePath) : "";
export const fromRoot = (...p: string[]): string => join(appDirectory, ...p);
export const hasFile = (...p: string[]): boolean => existsSync(fromRoot(...p));

export const hasScripts = hasPackageSubProperties("scripts");
export const hasPeerDep = hasPackageSubProperties("peerDependencies");
export const hasDep = hasPackageSubProperties("dependencies");
export const hasDevelopmentDep = hasPackageSubProperties("devDependencies");
// eslint-disable-next-line max-len
export const hasAnyDep = (arguments_: string[]): boolean => [hasDep, hasDevelopmentDep, hasPeerDep].some((function_: (arguments_: string[]) => boolean) => function_(arguments_));

export const hasTypescript: boolean = hasAnyDep(["typescript"]) && hasFile("tsconfig.json");

export const packageIsTypeModule = hasPackageProperties(["type"]) && packageJson?.["type"] === "module";

export const isPackageAvailable = (moduleName: string): boolean => {
    const targetModule = import.meta.url;
    // See https://yarnpkg.com/advanced/pnpapi
    if (process.versions["pnp"]) {
        // @ts-expect-error TS2339: Property 'findPnpApi' does not exist on type 'typeof Module'.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const targetPnp = module.findPnpApi(targetModule);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        if (targetPnp.resolveRequest(moduleName, targetModule)) {
            return true;
        }
    } else if (packageIsTypeModule) {
        // See https://nodejs.org/api/esm.html#esm_resolver_algorithm
        try {
            module.createRequire(targetModule).resolve(moduleName);

            return true;
        } catch {
            return false;
        }
    }

    try {
        // eslint-disable-next-line unicorn/prefer-module
        require.resolve(moduleName);

        return true;
    } catch {
        return false;
    }
};

export const showMissingPackages = (
    packageName: string,
    packages: string[],
    options: {
        exit?: boolean;
        consoleType?: "error" | "info" | "log" | "warn";
        preMessage?: string;
        postMessage?: string;
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

    if (process.env["NODE_ENV"] !== "test" || options.exit === true) {
        // eslint-disable-next-line no-undef
        process.exit(1); // eslint-disable-line unicorn/no-process-exit
    }
};

export const unique = (array: unknown[]): unknown[] => [...new Set(array)];

// eslint-disable-next-line unicorn/prevent-abbreviations
export const pkg = packageJson as readPkgUp.NormalizedReadResult | undefined;
