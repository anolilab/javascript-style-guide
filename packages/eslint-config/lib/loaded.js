const { consoleLog, consolePlugin } = require('./loggers');

module.exports = function showLoaded(rules, extraInstallPackage) {
    const installed = rules.map((plugin) => `eslint-plugin-${plugin}`);

    extraInstallPackage.forEach(([rule, package_]) => {
        if (rules.includes(rule)) {
            installed.push(package_);
        }
    });

    consoleLog('\n@anolilab\/eslint-config loaded the following packages:\n');
    installed.forEach(consolePlugin);
};
