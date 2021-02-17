const atLatest = (pkg) => {
    if (pkg.split('@').indexOf('@') === -1) {
        return `${pkg}@latest`;
    }

    return pkg
}

/**
 * @param {Array<string>} notInstalled
 */
module.exports = function (notInstalled) {
    const s = notInstalled.length === 1 ? '' : 's';

    console.log(`\nOops! Something went wrong! :(

@anolilab\/babel-preset could not find the following package${s}

  ${notInstalled.join('\n  ')}

To install the missing package${s}, please run the following command:

  npm install ${notInstalled.map(atLatest).join(' ')} --save-dev

or

  yarn add ${notInstalled.map(atLatest).join(' ')} --dev

  `);

    process.exit(1); // eslint-disable-line unicorn/no-process-exit
}
