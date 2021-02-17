const { consoleLog, consolePlugin } = require('./loggers');

module.exports = function showLoaded(rules, extraInstallPackage) {
    extraInstallPackage.forEach(([rule, package_]) => {
        if (rules.includes(rule)) {
            rules.push(package_);
        }
    });

    consoleLog('\n@anolilab\/eslint-config loaded the following packages:\n');
    rules.forEach(consolePlugin);
};
