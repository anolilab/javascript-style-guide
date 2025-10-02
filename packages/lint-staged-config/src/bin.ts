import { existsSync } from "node:fs";
import { join } from "node:path";
import { exit } from "node:process";

import {
    ensureDirSync,
    isAccessibleSync,
    writeFileSync,
} from "@visulima/fs";
import type { NormalizedPackageJson } from "@visulima/package";
import {
    hasPackageJsonAnyDependency,
    parsePackageJson,
} from "@visulima/package";

const checkIfFileExists = (filename: string): boolean => {
    if (isAccessibleSync(filename)) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ ${filename} already exists;`);

        return true;
    }

    return false;
};

/**
 * Writes .lintstagedrc.js if it doesn't exist. Warns if it exists.
 */
const writeLintStagedRc = async (cwd: string, isTypeModule: boolean) => {
    const configFile = ".lintstagedrc";

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
        if (checkIfFileExists(join(cwd, filename))) {
            // eslint-disable-next-line no-console
            console.warn(`⚠️  ${filename} already exists;`);

            return;
        }
    }

    const filePath = join(cwd, ".lintstagedrc.js");
    const content = `${isTypeModule ? "import { defineConfig } from \"@anolilab/lint-staged-config\"" : "const { defineConfig } = require(\"@anolilab/lint-staged-config\")"};

${isTypeModule ? "export default" : "module.exports ="} defineConfig();
`;

    writeFileSync(filePath, content);
};

const writeNanoStagedRc = async (cwd: string, isTypeModule: boolean) => {
    const configFile = ".nano-staged";

    for (const filename of [
        configFile,
        `${configFile}.js`,
        `${configFile}.cjs`,
        `${configFile}.mjs`,
        `${configFile}.json`,
        `${configFile.replace(".", "")}.js`,
        `${configFile.replace(".", "")}.cjs`,
        `${configFile.replace(".", "")}.mjs`,
        `${configFile.replace(".", "")}.json`,
        ".nanostagedrc",
    ]) {
        if (checkIfFileExists(join(cwd, filename))) {
            // eslint-disable-next-line no-console
            console.warn(`⚠️  ${filename} already exists;`);

            return;
        }
    }

    const filePath = join(cwd, ".nano-staged.js");
    const content = `${isTypeModule ? "import { defineConfig } from \"@anolilab/lint-staged-config\"" : "const { defineConfig } = require(\"@anolilab/lint-staged-config\")"};

${isTypeModule ? "export default" : "module.exports ="} defineConfig();
`;

    writeFileSync(filePath, content);
};

/**
 * Adds husky hooks to .husky folder if they don't exist. Warns if they exist.
 */

const writeHuskyFiles = async (
    cwd: string,
    packageJson: NormalizedPackageJson,
    hasNanoStaged: boolean,
) => {
    const hasHusky = hasPackageJsonAnyDependency(packageJson, ["husky"]);

    if (!hasHusky) {
        // eslint-disable-next-line no-console
        console.warn("⚠️ husky is not installed;");

        return;
    }

    const huskyFolderPath = join(cwd, ".husky");

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
`,
        );
    }

    const preCommitPath = join(huskyFolderPath, "pre-commit");

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

${hasNanoStaged ? "./node_modules/.bin/nano-staged" : "./node_modules/.bin/lint-staged --verbose --concurrent false"}

echo Finished Git hook: pre-commit
echo --------------------------------------------
`,
        );
    }

    const prepareCommitMessagePath = join(
        huskyFolderPath,
        "prepare-commit-msg",
    );
    const hasCz = hasPackageJsonAnyDependency(packageJson, ["commitizen"]);

    if (hasCz && !checkIfFileExists(prepareCommitMessagePath)) {
        writeFileSync(
            prepareCommitMessagePath,
            `#!/bin/sh

. "$(dirname "$0")/_/husky.sh"
. "$(dirname "$0")/common.sh"

echo --------------------------------------------
echo Starting Git hook: prepare-commit-msg

# if we hve a cmd that is running ./node_modules/.bin/cz that means finalize and commit
FILE=commit.cmd
if test -f "$FILE"; then
    echo "$FILE exists."
    rm commit.cmd
    exit 0;
fi
# if on Windows, spawn a cmd that will run ./node_modules/.bin/cz
case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS* )
        # Only run commitizen if no commit message was already provided.
        if [ -z "\${2-}" ]; then
            export CZ_TYPE="\${CZ_TYPE:-fix}"
            export CZ_MAX_HEADER_WIDTH=$COMMITLINT_MAX_WIDTH
            export CZ_MAX_LINE_WIDTH=$CZ_MAX_HEADER_WIDTH
            echo "./node_modules/.bin/cz && exit" > commit.cmd
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
    exec < /dev/tty && ./node_modules/.bin/cz --hook || true
fi

echo Finished Git hook: prepare-commit-msg
echo --------------------------------------------
`,
        );
    }
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    const cwd = process.cwd();

    // eslint-disable-next-line no-console
    console.log("Configuring @anolilab/lint-staged-config", cwd, "\n");

    const packageJsonPath = join(cwd, "package.json");

    if (!existsSync(packageJsonPath)) {
        // eslint-disable-next-line no-console
        console.error(
            "No package.json found in the current directory. You need to run this command in a directory with a package.json file.",
        );

        exit(1);
    }

    const packageJson = await parsePackageJson(packageJsonPath);
    const isTypeModule = packageJson.type === "module";

    const hasLintStaged = hasPackageJsonAnyDependency(packageJson, [
        "lint-staged",
    ]);
    const hasNanoStaged = hasPackageJsonAnyDependency(packageJson, [
        "nano-staged",
    ]);

    try {
        if (hasLintStaged) {
            await writeLintStagedRc(cwd, isTypeModule);
        } else if (hasNanoStaged) {
            await writeNanoStagedRc(cwd, isTypeModule);
        }

        await writeHuskyFiles(cwd, packageJson, hasNanoStaged);

        // eslint-disable-next-line no-console
        console.log("Everything went well, have fun!");

        exit(0);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Something went wrong:", error);

        exit(1);
    }
})();
