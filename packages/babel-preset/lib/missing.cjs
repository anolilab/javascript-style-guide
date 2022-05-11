const atLatest = (package_) => {
    if (!package_.split("@").includes("@")) {
        return `${package_}@latest`;
    }

    return package_;
};

/**
 * @param {Array<string>} notInstalled
 */
module.exports = function missing(notInstalled) {
    const s = notInstalled.length === 1 ? "" : "s";

    console.log(`\nOops! Something went wrong! :(

@anolilab/babel-preset could not find the following package${s}

  ${notInstalled.join("\n  ")}

To install the missing package${s}, please run the following command:

  npm install ${notInstalled.map((element) => atLatest(element)).join(" ")} --save-dev

or

  yarn add ${notInstalled.map((element) => atLatest(element)).join(" ")} --dev

  `);

    // eslint-disable-next-line no-undef
    process.exit(1); // eslint-disable-line unicorn/no-process-exit
};
