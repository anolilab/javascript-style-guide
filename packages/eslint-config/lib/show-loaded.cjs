const { consoleLog, consolePlugin } = require("./loggers.cjs");

module.exports = function showLoaded(rules, extraInstallPackage) {
    const all = [...rules];

    extraInstallPackage.forEach(([rule, package_]) => {
        if (all.includes(rule)) {
            all.push(package_);
        }
    });

    consoleLog("\n@anolilab/eslint-config loaded the following packages:\n");

    all.forEach((element) => {
        if (element[0] === "@" || element === "typescript") {
            consoleLog(`  ${element}`);
        } else {
            consolePlugin(element);
        }
    });
};
