const isModuleAvailable = require("./is-module-available.cjs");
const { consoleLog } = require("./loggers.cjs");

const moduleNotAvailable = (package_) => !isModuleAvailable(package_);

const atLatest = (package_) => {
    if (!package_.split("@").includes("@")) {
        return `${package_}@latest`;
    }

    return package_;
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

    const s = notInstalled.length === 1 ? "" : "s";

    consoleLog(`\nOops! Something went wrong! :(

@anolilab/eslint-config could not find the following package${s}

  ${notInstalled.join("\n  ")}

To install the missing package${s}, please run the following command:

  npm install ${notInstalled.map((element) => atLatest(element)).join(" ")} --save-dev

or

  yarn add ${notInstalled.map((element) => atLatest(element)).join(" ")} --dev

or

  pnpm add ${notInstalled.map((element) => atLatest(element)).join(" ")} -D
`);

    // process.exit(1); // eslint-disable-line unicorn/no-process-exit
};
