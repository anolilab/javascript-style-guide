// From kcd-scripts
import { existsSync, realpathSync } from 'fs';
import { dirname, join } from 'path';
import has from 'lodash.has';
import arrify from 'arrify';
import { cosmiconfigSync } from 'cosmiconfig';
import { readPackageUpSync } from 'read-pkg-up';

const { packageJson: package_, path: packagePath } = readPackageUpSync({
    cwd: realpathSync(process.cwd()),
});
const hasPackageProperty = (properties) =>
    arrify(properties).some((property) => has(package_, property)); // eslint-disable-line lodash-fp/no-extraneous-function-wrapping

const hasPackageSubProperty = (packageProperty) => (properties) =>
    hasPackageProperty(arrify(properties).map((p) => `${packageProperty}.${p}`));


export const appDirectory = dirname(packagePath);
export const fromRoot = (...p) => join(appDirectory, ...p);
export const hasFile = (...p) => existsSync(fromRoot(...p));
export const hasScript = hasPackageSubProperty('scripts');
export const hasPeerDep = hasPackageSubProperty('peerDependencies');
export const hasDep = hasPackageSubProperty('dependencies');
export const hasDevelopmentDep = hasPackageSubProperty('devDependencies');
export const hasAnyDep = (args) => [hasDep, hasDevelopmentDep, hasPeerDep].some((fn) => fn(args));
export const hasTypescript = hasAnyDep('typescript') && hasFile('tsconfig.json');

function environmentIsSet(name) {
    return (
        process.env.hasOwnProperty(name) && // eslint-disable-line no-prototype-builtins
        process.env[name] &&
        process.env[name] !== 'undefined'
    );
}

function parseEnvironment(name, def) {
    if (environmentIsSet(name)) {
        try {
            return JSON.parse(process.env[name]);
        } catch (error) {
            return process.env[name];
        }
    }
    return def;
}

export function uniq(array) {
    return [...new Set(array)];
}
export function hasLocalConfig(moduleName, searchOptions = {}) {
    const explorerSync = cosmiconfigSync(moduleName, searchOptions);
    const result = explorerSync.search(packagePath);

    return result !== null;
}
export const hasPkgProp = hasPackageProperty;
export const parseEnv = parseEnvironment;
export const pkg = package_;
