// From kcd-scripts
const { existsSync, realpathSync } = require('fs');
const { dirname, join } = require('path');
const has = require('lodash.has');
const arrify = require('arrify');
const { cosmiconfigSync } = require('cosmiconfig');
const readPkgUp = require('read-pkg-up');

const { packageJson: package_, path: packagePath } = readPkgUp.sync({
    cwd: realpathSync(process.cwd()),
});
const hasPackageProperty = (properties) =>
    arrify(properties).some((property) => has(package_, property)); // eslint-disable-line lodash-fp/no-extraneous-function-wrapping

const hasPackageSubProperty = (packageProperty) => (properties) =>
    hasPackageProperty(arrify(properties).map((p) => `${packageProperty}.${p}`));

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

const appDirectory = dirname(packagePath);
const fromRoot = (...p) => join(appDirectory, ...p);
const hasFile = (...p) => existsSync(fromRoot(...p));
const hasScript = hasPackageSubProperty('scripts');
const hasPeerDep = hasPackageSubProperty('peerDependencies');
const hasDep = hasPackageSubProperty('dependencies');
const hasDevelopmentDep = hasPackageSubProperty('devDependencies');
const hasAnyDep = (args) => [hasDep, hasDevelopmentDep, hasPeerDep].some((fn) => fn(args));
const hasTypescript = hasAnyDep('typescript') && hasFile('tsconfig.json');

module.exports = {
    uniq: function uniq(array) {
        return [...new Set(array)];
    },
    hasLocalConfig: function hasLocalConfig(moduleName, searchOptions = {}) {
        const explorerSync = cosmiconfigSync(moduleName, searchOptions);
        const result = explorerSync.search(packagePath);

        return result !== null;
    },
    hasPkgProp: hasPackageProperty,
    parseEnv: parseEnvironment,
    pkg: package_,
    appDirectory,
    fromRoot,
    hasFile,
    hasScript,
    hasPeerDep,
    hasDep,
    hasDevelopmentDep,
    hasAnyDep,
    hasTypescript,
}
