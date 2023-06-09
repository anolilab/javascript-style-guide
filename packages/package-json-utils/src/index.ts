import { existsSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import readPkgUp from "read-pkg-up";
import module from "module";

export const arrify = (value: any): any[] => {
    if (value === null || value === undefined) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string") {
        return [value];
    }

    if (typeof value[Symbol.iterator] === "function") {
        return [...value];
    }

    return [value];
};

const { packageJson: package_, path: packagePath } = readPkgUp.sync({
    cwd: realpathSync(process.cwd()),
}) || { packageJson: null, path: null };

export const hasPackageProperty = (properties: any): boolean =>
    arrify(properties).some((property: any) => package_ !== null && Object.hasOwnProperty.call(package_, property));

export const hasPackageSubProperty =
    (packageProperty: string) =>
    (properties: any): boolean =>
        hasPackageProperty(arrify(properties).map((p: string) => `${packageProperty}.${p}`));

export const environmentIsSet = (name: string): boolean =>
    Boolean(process.env.hasOwnProperty(name) && process.env[name] && process.env[name] !== "undefined");

export const parseEnvironment = (name: string, def: any): any => {
    if (environmentIsSet(name)) {
        try {
            return JSON.parse(process.env[name] || "");
        } catch {
            return process.env[name];
        }
    }

    return def;
};

export const appDirectory: string = packagePath ? dirname(packagePath) : "";
export const fromRoot = (...p: string[]): string => join(appDirectory, ...p);
export const hasFile = (...p: string[]): boolean => existsSync(fromRoot(...p));

export const hasScript = hasPackageSubProperty("scripts");
export const hasPeerDep = hasPackageSubProperty("peerDependencies");
export const hasDep = hasPackageSubProperty("dependencies");
export const hasDevelopmentDep = hasPackageSubProperty("devDependencies");
export const hasAnyDep = (arguments_: any): boolean =>
    [hasDep, hasDevelopmentDep, hasPeerDep].some((function_: any) => function_(arguments_));

export const hasTypescript: boolean = hasAnyDep("typescript") && hasFile("tsconfig.json");

export const pkgIsTypeModule = hasPackageSubProperty("type") && package_?.["type"] === "module";

export const isPackageAvailable = (moduleName: string) => {
    const targetModule = import.meta.url;
    // See https://yarnpkg.com/advanced/pnpapi
    if (process.versions?.["pnp"]) {
        // @ts-expect-error TS2339: Property 'findPnpApi' does not exist on type 'typeof Module'.
        const targetPnp = module.findPnpApi(targetModule);

        if (targetPnp.resolveRequest(moduleName, targetModule)) {
            return true;
        }
    } else if (pkgIsTypeModule) {
        // See https://nodejs.org/api/esm.html#esm_resolver_algorithm
        try {
            module.createRequire(targetModule).resolve(moduleName);

            return true;
        } catch (error) {
            return false;
        }
    }

    try {
        require.resolve(moduleName);

        return true;
    } catch (error) {
        return false;
    }
};

export const showMissingPackages = (packageName: string, packages: string[]) => {
    const atLatest = (package_: string) => {
        if (!package_.split("@").includes("@")) {
            return `${package_}@latest`;
        }

        return package_;
    };

    const s = packages.length === 1 ? "" : "s";

    console.warn(`\nOops! Something went wrong! :(

${packageName} could not find the following package${s}

  ${packages.join("\n  ")}

To install the missing package${s}, please run the following command:

  npm install ${packages.map((element) => atLatest(element)).join(" ")} --save-dev

or

  yarn add ${packages.map((element) => atLatest(element)).join(" ")} --dev

or

  pnpm add ${packages.map((element) => atLatest(element)).join(" ")} -D
`);

    // eslint-disable-next-line no-undef
    process.exit(1); // eslint-disable-line unicorn/no-process-exit
};

export const unique = (array: any[]): any[] => [...new Set(array)];

export const pkg = package_ as readPkgUp.NormalizedReadResult | null;
