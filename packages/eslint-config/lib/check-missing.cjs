const isModuleAvailable = require('./is-module-available.cjs');
const { consoleLog } = require('./loggers.cjs');

const moduleNotAvailable = (package_) => !isModuleAvailable(package_.split('@')[0]);

const atLatest = (pkg) => {
    if (pkg.split('@').indexOf('@') === -1) {
        return `${pkg}@latest`;
    }

    return pkg;
};

module.exports = function checkMissing(rules, extraInstallPackage) {
    const notInstalled = rules
        .map((plugin) => `eslint-plugin-${plugin}`)
        .filter((package_) => moduleNotAvailable(package_));

    extraInstallPackage.forEach(([rule, package_]) => {
        if (rules.includes(rule) && moduleNotAvailable(package_)) {
            notInstalled.push(package_);
        }
    });

    if (notInstalled.length === 0) {
        return;
    }

    const s = notInstalled.length === 1 ? '' : 's';

    consoleLog(`\nOops! Something went wrong! :(

@anolilab\/eslint-config could not find the following package${s}

  ${notInstalled.join('\n  ')}

To install the missing package${s}, please run the following command:

  npm install ${notInstalled.map(atLatest).join(' ')} --save-dev

or

  yarn add ${notInstalled.map(atLatest).join(' ')} --dev

  `);

    // process.exit(1); // eslint-disable-line unicorn/no-process-exit
};
