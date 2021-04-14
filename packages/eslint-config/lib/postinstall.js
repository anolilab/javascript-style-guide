#!/usr/bin/env node

if (process.env.CI) {
    process.exit();
}

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { hasAnyDep } = require("./utils");

const writeFileAsync = promisify(fs.writeFile);

// get the path to the host project.
const projectPath = path.resolve(process.cwd(), "..", "..", "..");

console.log("Configuring @anolilab/eslint-config", projectPath, "\n");

/**
 * Writes .eslintrc.js if it doesn't exist. Warns if it exists.
 */
const writeEslintRc = () => {
    const eslintPath = path.join(projectPath, ".eslintrc.js");
    const content = `module.exports = {
    root: true,
    extends: ["@anolilab/eslint-config"],
    env: {
        // Your environments (which contains several predefined global variables)
        //
        // browser: true,
        // node: true,
        // mocha: true,
        // jest: true,
        // jquery: true
    },
    globals: {
        // Your global variables (setting to false means it's not allowed to be reassigned)
        //
        // myGlobal: false
    },
    rules: {
        // Customize your rules
    }
};
`;

    if (fs.existsSync(eslintPath)) {
        console.warn(`⚠️  .eslintrc.js already exists;
Make sure that it includes the following for @anolilab/eslint-config'
to work as it should: { extends: ["@anolilab/eslint-config"] }.`);

        return Promise.resolve();
    }

    return writeFileAsync(eslintPath, content, "utf-8");
};

/**
 * Writes .prettierrc.js if it doesn't exist. Warns if it exists.
 */
const writePrettierRc = () => {
    const prettierPath = path.join(projectPath, ".prettierrc.js");
    const content = {
        // max 120 characters per line
        printWidth: 120,
        // use 2 spaces for indentation
        tabWidth: 4,
        // use spaces instead of indentations
        useTabs: false,
        // semicolon at the end of the line
        semi: true,
        // use single quotes
        singleQuote: false,
        // object's key is quoted only when necessary
        quoteProps: "as-needed",
        // use double quotes instead of single quotes in jsx
        jsxSingleQuote: false,
        // no comma at the end
        trailingComma: "all",
        // spaces are required at the beginning and end of the braces
        bracketSpacing: true,
        // end tag of jsx need to wrap
        jsxBracketSameLine: false,
        // brackets are required for arrow function parameter, even when there is only one parameter
        arrowParens: "always",
        // format the entire contents of the file
        rangeStart: 0,
        rangeEnd: Infinity,
        // no need to write the beginning @prettier of the file
        requirePragma: false,
        // No need to automatically insert @prettier at the beginning of the file
        insertPragma: false,
        // use default break criteria
        proseWrap: "preserve",
        // decide whether to break the html according to the display style
        htmlWhitespaceSensitivity: "css",
        // vue files script and style tags indentation
        vueIndentScriptAndStyle: false,
        // lf for newline
        endOfLine: "lf",
        // formats quoted code embedded
        embeddedLanguageFormatting: "auto",
    };

    if (fs.existsSync(prettierPath) || fs.existsSync(prettierPath.replace('.js', ''))) {
        console.warn(`⚠️  .prettierrc.js already exists;
Make sure that it includes the following for @anolilab/eslint-config to work as it should:
${JSON.stringify(content, null, 4)}\n`);

        return Promise.resolve();
    }

    return writeFileAsync(
        prettierPath,
        `module.exports = ${JSON.stringify(content, null, 2)}\n`,
        "utf-8",
    );
};

/**
 * Writes .prettierignore if it doesn't exist. Warns if it exists.
 */
const writePrettierIgnore = () => {
    const prettierPath = path.join(projectPath, ".prettierignore");

    if (fs.existsSync(prettierPath)) {
        console.warn(`⚠️  .prettierignore already exists`);

        return Promise.resolve();
    }

    return writeFileAsync(prettierPath, "", "utf-8");
};

(async () => {
    try {
        const promises = [writeEslintRc()];

        if (hasAnyDep("prettier")) {
            promises.push(writePrettierRc());
            promises.push(writePrettierIgnore())
        }

        await Promise.all(promises);

        console.log("😎  Everything went well, have fun!");

        process.exit();
    } catch (err) {
        console.log("😬  something went wrong:");
        console.error(err.message);

        process.exit(1);
    }
})();
