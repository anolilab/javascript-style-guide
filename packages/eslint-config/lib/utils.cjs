// From kcd-scripts
const { existsSync, realpathSync } = require("node:fs");
// eslint-disable-next-line unicorn/import-style
const { dirname, join } = require("node:path");
// eslint-disable-next-line lodash/import-scope
const has = require("lodash.has");
const readPkgUp = require("read-pkg-up");

function arrify(value) {
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
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const { packageJson: package_, path: packagePath } = readPkgUp.sync({
    // eslint-disable-next-line no-undef
    cwd: realpathSync(process.cwd()),
});
// eslint-disable-next-line max-len
const hasPackageProperty = (properties) => arrify(properties).some((property) => has(package_, property)); // eslint-disable-line lodash-fp/no-extraneous-function-wrapping

const hasPackageSubProperty = (packageProperty) => (properties) => hasPackageProperty(arrify(properties).map((p) => `${packageProperty}.${p}`));

function environmentIsSet(name) {
    return (
        // eslint-disable-next-line no-undef
        process.env.hasOwnProperty(name) // eslint-disable-line no-prototype-builtins
        // eslint-disable-next-line no-undef
        && process.env[name]
        // eslint-disable-next-line no-undef
        && process.env[name] !== "undefined"
    );
}

// eslint-disable-next-line unicorn/prevent-abbreviations
function parseEnvironment(name, def) {
    if (environmentIsSet(name)) {
        try {
            // eslint-disable-next-line no-undef
            return JSON.parse(process.env[name]);
        } catch {
            // eslint-disable-next-line no-undef
            return process.env[name];
        }
    }
    return def;
}

const appDirectory = dirname(packagePath);
const fromRoot = (...p) => join(appDirectory, ...p);
const hasFile = (...p) => existsSync(fromRoot(...p));
const hasScript = hasPackageSubProperty("scripts");
const hasPeerDep = hasPackageSubProperty("peerDependencies");
const hasDep = hasPackageSubProperty("dependencies");
const hasDevelopmentDep = hasPackageSubProperty("devDependencies");
const hasAnyDep = (arguments_) => [hasDep, hasDevelopmentDep, hasPeerDep].some((function_) => function_(arguments_));
const hasTypescript = hasAnyDep("typescript") && hasFile("tsconfig.json");

module.exports = {
    uniq: function uniq(array) {
        return [...new Set(array)];
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
};
