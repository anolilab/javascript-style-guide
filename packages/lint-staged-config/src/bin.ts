import { join } from "node:path";
import { exit } from "node:process";

import { hasDependency, hasDevDependency, packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import { ensureDirSync, isAccessibleSync, writeFileSync } from "@visulima/fs";

import getNearestConfigPath from "./utils/get-nearest-config-path";

console.log("Configuring @anolilab/lint-staged-config", projectPath, "\n");

const configFile = ".lintstagedrc";

const checkIfFileExists = (filename: string): boolean => {
    if (isAccessibleSync(filename)) {
        console.warn(`⚠️ ${filename} already exists;`);

        return true;
    }

    return false;
};

/**
 * Writes .lintstagedrc.js if it doesn't exist. Warns if it exists.
 */
const writeLintstagedRc = async () => {
    // eslint-disable-next-line no-restricted-syntax,no-loops/no-loops
    for (const filename of [
        configFile,
        `${configFile}.js`,
        `${configFile}.cjs`,
        `${configFile}.mjs`,
        `${configFile}.json`,
        `${configFile}.yaml`,
        `${configFile}.yml`,
        "lint-staged.config.js",
        "lint-staged.config.mjs",
        "lint-staged.config.cjs",
    ]) {
        if (checkIfFileExists(join(projectPath, filename))) {
            return;
        }
    }

    const lintstagedPath = join(projectPath, ".lintstagedrc.js");

    const content = `${packageIsTypeModule ? 'import config from "@anolilab/lint-staged-config"' : 'const config = require("@anolilab/lint-staged-config")'};

${packageIsTypeModule ? "export default" : "module.exports ="} {
    ...config,
};
`;

    writeFileSync(lintstagedPath, content, );
};

/**
 * Adds husky hooks to .husky folder if they don't exist. Warns if they exist.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const writeHuskyFiles = async () => {
    const hasHusky = hasDependency("husky") || hasDevDependency("husky");

    if (!hasHusky) {
        console.warn("⚠️ husky is not installed;");

        return;
    }

    const huskyFolderPath = join(projectPath, ".husky");

    ensureDirSync(huskyFolderPath);

    const commonShPath = join(huskyFolderPath, "common.sh");

    if (!checkIfFileExists(commonShPath)) {
        writeFileSync(
            commonShPath,
            `#!/bin/sh

command_exists () {
  command -v "$1" >/dev/null 2>&1
}

IS_WINDOWS="false"

if [ "$OSTYPE" = "cygwin" ]; then
    IS_WINDOWS="true"
elif [ "$OSTYPE" = "msys" ]; then
    IS_WINDOWS="true"
elif [ "$OSTYPE" = "win32" ]; then
    IS_WINDOWS="true"
fi

# Workaround for Windows 10, Git Bash and Yarn
if [ "$IS_WINDOWS" = "true" ]; then
    if command_exists winpty && test -t 1; then
        exec < /dev/tty
    fi
fi
`
        );
    }

    const preCommitPath = join(huskyFolderPath, "pre-commit");

    let hasPnpm = false;

    try {
        getNearestConfigPath("pnpm-lock.yaml");

        hasPnpm = true;
    } catch {
        hasPnpm = false;
    }

    if (!checkIfFileExists(preCommitPath)) {
        writeFileSync(
            preCommitPath,
            `#!/bin/sh

. "$(dirname "$0")/_/husky.sh"
. "$(dirname "$0")/common.sh"

# The hook should exit with non-zero status after issuing
# an appropriate message if it wants to stop the commit.

echo --------------------------------------------
echo Starting Git hook: pre-commit

${hasPnpm ? "pnpx" : "npx"} lint-staged --verbose --concurrent false

echo Finished Git hook: pre-commit
echo --------------------------------------------
`
        );
    }

    const prepareCommitMessagePath = join(huskyFolderPath, "prepare-commit-msg");
    const hasCz = hasDependency("commitizen") || hasDevDependency("commitizen");

    if (hasCz && !checkIfFileExists(prepareCommitMessagePath)) {
        writeFileSync(
            prepareCommitMessagePath,
            `#!/bin/sh

. "$(dirname "$0")/_/husky.sh"
. "$(dirname "$0")/common.sh"

echo --------------------------------------------
echo Starting Git hook: prepare-commit-msg

# if we hve a cmd that is running ${hasPnpm ? "pnpx" : "npx"} cz that means finalize and commit
FILE=commit.cmd
if test -f "$FILE"; then
    echo "$FILE exists."
    rm commit.cmd
    exit 0;
fi
# if on Windows, spawn a cmd that will run ${hasPnpm ? "pnpx" : "npx"} cz
case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS* )
        # Only run commitizen if no commit message was already provided.
        if [ -z "\${2-}" ]; then
            export CZ_TYPE="\${CZ_TYPE:-fix}"
            export CZ_MAX_HEADER_WIDTH=$COMMITLINT_MAX_WIDTH
            export CZ_MAX_LINE_WIDTH=$CZ_MAX_HEADER_WIDTH
            echo "${hasPnpm ? "pnpx" : "npx"} cz && exit" > commit.cmd
            start commit.cmd
            exit 1;
        fi

        exit 0;;
esac

# Only run commitizen if no commit message was already provided.
if [ -z "\${2-}" ]; then
    export CZ_TYPE="\${CZ_TYPE:-fix}"
    export CZ_MAX_HEADER_WIDTH=$COMMITLINT_MAX_WIDTH
    export CZ_MAX_LINE_WIDTH=$CZ_MAX_HEADER_WIDTH
    # By default git hooks are not interactive. exec < /dev/tty allows a users terminal to interact with commitizen.
    exec < /dev/tty && ${hasPnpm ? "pnpx" : "npx"} cz --hook || true
fi

echo Finished Git hook: prepare-commit-msg
echo --------------------------------------------
`
        );
    }
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        await writeLintstagedRc();
        await writeHuskyFiles();

        console.log("😎 Everything went well, have fun!");

        exit(0);
    } catch (error) {
        console.log("😬 something went wrong:");
        console.error(error);

        exit(1);
    }
})();
