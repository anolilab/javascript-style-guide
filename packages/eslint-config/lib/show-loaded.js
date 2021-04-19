import { consoleLog, consolePlugin } from './loggers.js';

export default function showLoaded(rules, extraInstallPackage) {
    extraInstallPackage.forEach(([rule, package_]) => {
        if (rules.includes(rule)) {
            rules.push(package_);
        }
    });

    consoleLog('\n@anolilab\/eslint-config loaded the following packages:\n');
    rules.forEach(consolePlugin);
};
