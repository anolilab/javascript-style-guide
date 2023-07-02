import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import { existsSync, readFileSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import type { TsConfigJson } from "type-fest";

if (process.env["CI"]) {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/eslint-config", projectPath, "\n");

const configFile = ".eslintrc";

/**
 * Writes .eslintrc.js if it doesn't exist. Warns if it exists.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const writeEslintRc = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const filename of [configFile, `${configFile}.js`, `${configFile}.cjs`, `${configFile}.json`, `${configFile}.yaml`, `${configFile}.yml`]) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (existsSync(join(projectPath, filename))) {
            console.warn(`⚠️  ${filename} already exists;
Make sure that it includes the following for @anolilab/eslint-config'
to work as it should: { extends: ["@anolilab/eslint-config"] }.`);

            return Promise.resolve();
        }
    }

    const eslintPath = join(projectPath, `.eslintrc.${packageIsTypeModule ? "c" : ""}js`);

    let pluginExtends = "";
    let parserOptions = `
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: ${packageIsTypeModule ? '"module"' : '"commonjs"'},
    },`;

    const tsconfigPath = join(projectPath, "tsconfig.json");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(tsconfigPath)) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const tsConfig = JSON.parse(readFileSync(tsconfigPath, "utf8")) as TsConfigJson;

        let ecmaVersion = "latest";

        if (tsConfig.compilerOptions?.target) {
            ecmaVersion = tsConfig.compilerOptions.target;

            ecmaVersion =
                ecmaVersion.toLowerCase() === "es2022" || ecmaVersion.toLowerCase() === "esnext" ? "latest" : ecmaVersion.toLowerCase().replace("es", "");

            if (ecmaVersion !== "latest" && ecmaVersion !== "2022" && ecmaVersion !== "2021" && ecmaVersion !== "6") {
                pluginExtends = `, "plugin:es-x/restrict-to-es${ecmaVersion}"`;
            }
        }

        parserOptions = `
    parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: ${ecmaVersion === "latest" ? `"${ecmaVersion}"` : ecmaVersion},
        sourceType: ${packageIsTypeModule ? '"module"' : '"commonjs"'},
    },`;
    }

    const content = `/** @ts-check */
/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ["@anolilab/eslint-config"${pluginExtends}],
    ignorePatterns: ["!**/*"],
    env: {
        // Your environments (which contains several predefined global variables)
        // Most environments are loaded automatically if our rules are added
    },${parserOptions}
    globals: {
        // Your global variables (setting to false means it's not allowed to be reassigned)
        // myGlobal: false
    },
    rules: {
        // Customize your rules
    },
    overrides: [
        {
            files: [
                "*.ts",
                "*.tsx",
                "*.mts",
                "*.cts",
                "*.js",
                "*.jsx",
            ],
            // Set parserOptions.project for the project to allow TypeScript to create the type-checker behind the scenes when we run linting
            parserOptions: {},
            rules: {},
        },
        {
            files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
            // Set parserOptions.project for the project to allow TypeScript to create the type-checker behind the scenes when we run linting
            parserOptions: {},
            rules: {},
        },
        {
            files: ["*.js", "*.jsx"],
            rules: {},
        },
    ],
};
`;

    return writeFileAsync(eslintPath, content, "utf8");
};

/**
 * Writes .eslintignore if it doesn't exist. Warns if it exists.
 */
const writeEslintIgnore = () => {
    const eslintIgnorePath = join(projectPath, ".eslintignore");

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(eslintIgnorePath)) {
        console.warn("⚠️  .eslintignore already exists");

        return Promise.resolve();
    }

    return writeFileAsync(eslintIgnorePath, "", "utf8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        // eslint-disable-next-line compat/compat
        await Promise.all([writeEslintRc(), writeEslintIgnore()]);

        console.log("😎  Everything went well, have fun!");

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error);

        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }
})();
