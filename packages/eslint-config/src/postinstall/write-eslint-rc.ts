import { existsSync, readFileSync, writeFile } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

import { packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import type { TsConfigJson } from "type-fest";

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/eslint-config", projectPath, "\n");

const configFile = ".eslintrc";

// eslint-disable-next-line sonarjs/cognitive-complexity
const writeEslintRc = async (): Promise<void> => {
    // eslint-disable-next-line no-restricted-syntax,no-loops/no-loops
    for (const filename of [configFile, `${configFile}.js`, `${configFile}.cjs`, `${configFile}.json`, `${configFile}.yaml`, `${configFile}.yml`]) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (existsSync(join(projectPath, filename))) {
            console.warn(`⚠️  ${filename} already exists;
Make sure that it includes the following for @anolilab/eslint-config'
to work as it should: { extends: ["@anolilab/eslint-config"] }.`);

            return;
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

    let ecmaVersion = "latest";

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(tsconfigPath)) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const tsConfig = JSON.parse(readFileSync(tsconfigPath, "utf8")) as TsConfigJson;

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
        project: true,
        ecmaVersion: ${ecmaVersion === "latest" ? `"${ecmaVersion}"` : ecmaVersion},
        sourceType: ${packageIsTypeModule ? '"module"' : '"commonjs"'},
    },`;
    }

    const content = `/** @ts-check */
const { defineConfig } = require('@anolilab/eslint-config/define-config');
${["es2015", "es2017", "es2020", "es2021", "latest"].includes(ecmaVersion) ? 'const { globals } = require("@anolilab/eslint-config/globals");\n\n' : ""}
module.exports = defineConfig({
    root: true,
    extends: ["@anolilab/eslint-config"${pluginExtends}],
    ignorePatterns: ["!**/*"],
    env: {
        // Your environments (which contains several predefined global variables)
        // Most environments are loaded automatically if our rules are added
    },${parserOptions}
    globals: {${
    ["es2015", "es2017", "es2020", "es2021", "latest"].includes(ecmaVersion)
        ? `\n        ...globals.${ecmaVersion === "latest" ? "es2021" : ecmaVersion},`
        : ""
}
        // Your global variables (setting to false means it's not allowed to be reassigned)
        // myGlobal: false
    },
    rules: {
        // Customize your rules
    },
    overrides: [
        {
            files: [
                "**/*.ts",
                "**/*.tsx",
                "**/*.mts",
                "**/*.cts",
                "**/*.js",
                "**/*.jsx",
            ],
            // Set parserOptions.project for the project to allow TypeScript to create the type-checker behind the scenes when we run linting
            parserOptions: {},
            rules: {},
        },
        {
            files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
            // Set parserOptions.project for the project to allow TypeScript to create the type-checker behind the scenes when we run linting
            parserOptions: {},
            rules: {},
        },
        {
            files: ["**/*.js", "**/*.jsx"],
            rules: {},
        },
    ],
});
`;

    await writeFileAsync(eslintPath, content, "utf8");
};

export default writeEslintRc;
