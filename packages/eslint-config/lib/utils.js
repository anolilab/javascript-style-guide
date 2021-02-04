// From kcd-scripts

const fs = require('fs');
const path = require('path');
const arrify = require('arrify');
const has = require('lodash.has');
const readPkgUp = require('read-pkg-up');
const { cosmiconfigSync } = require('cosmiconfig');

const { packageJson: package_, path: packagePath } = readPkgUp.sync({
    cwd: fs.realpathSync(process.cwd()),
});

const appDirectory = path.dirname(packagePath);

const fromRoot = (...p) => path.join(appDirectory, ...p);
const hasFile = (...p) => fs.existsSync(fromRoot(...p));

const hasPackageProperty = (properties) =>
    arrify(properties).some((property) => has(package_, property)); // eslint-disable-line lodash-fp/no-extraneous-function-wrapping

const hasPackageSubProperty = (packageProperty) => (properties) =>
    hasPackageProperty(arrify(properties).map((p) => `${packageProperty}.${p}`));

const hasScript = hasPackageSubProperty('scripts');
const hasPeerDep = hasPackageSubProperty('peerDependencies');
const hasDep = hasPackageSubProperty('dependencies');
const hasDevelopmentDep = hasPackageSubProperty('devDependencies');
const hasAnyDep = (args) => [hasDep, hasDevelopmentDep, hasPeerDep].some((fn) => fn(args));
const hasTypescript = hasAnyDep('typescript') && hasFile('tsconfig.json');

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

function uniq(array) {
    return [...new Set(array)];
}

function hasLocalConfig(moduleName, searchOptions = {}) {
    const explorerSync = cosmiconfigSync(moduleName, searchOptions);
    const result = explorerSync.search(packagePath);

    return result !== null;
}

module.exports = {
    appDirectory,
    fromRoot,
    hasFile,
    hasLocalConfig,
    hasPkgProp: hasPackageProperty,
    hasScript,
    hasAnyDep,
    hasTypescript,
    parseEnv: parseEnvironment,
    pkg: package_,
    uniq,
};
