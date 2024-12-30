import fs from "node:fs/promises";

import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import combine from "../src/utils/combine";

import yaml from "../src/config/plugins/yml";
import comments from "../src/config/plugins/comments";
import imports from "../src/config/plugins/imports";
import jsxA11y from "../src/config/plugins/jsx-a11y";
import jsdoc from "../src/config/plugins/jsdoc";
import jsonc from "../src/config/plugins/jsonc";
import markdown from "../src/config/plugins/markdown";
import perfectionist from "../src/config/plugins/perfectionist";
import react from "../src/config/plugins/react";
import { sortPackageJson } from "sort-package-json";
import stylistic from "../src/config/plugins/stylistic";
import toml from "../src/config/plugins/toml";
import regexp from "../src/config/plugins/regexp";
import unicorn from "../src/config/plugins/unicorn";
import node from "../src/config/plugins/node";
import vitest from "../src/config/plugins/vitest";
import antfu from "../src/config/plugins/antfu";
import compat from "../src/config/plugins/compat";
import html from "../src/config/plugins/html";
import noSecrets from "../src/config/plugins/no-secrets";
import noUnsanitized from "../src/config/plugins/no-unsanitized";
import playwright from "../src/config/plugins/playwright";
import promise from "../src/config/plugins/promise";
import simpleImportSort from "../src/config/plugins/simple-import-sort";
import sonarjs from "../src/config/plugins/sonarjs";
import storybook from "../src/config/plugins/storybook";
import tailwindcss from "../src/config/plugins/tailwindcss";
import tanstackQuery from "../src/config/plugins/tanstack-query";
import tsdoc from "../src/config/plugins/tsdoc";
import validateJsxNesting from "../src/config/plugins/validate-jsx-nesting";
import bestPractices from "../src/config/best-practices";
import variables from "../src/config/variables";
import style from "../src/config/style";
import errors from "../src/config/errors";
import typescript from "../src/config/plugins/typescript";
import javascript from "../src/config/plugins/javascript";


import type { NormalizedPackageJson } from "@visulima/package";

const fakePackageJson = {} as NormalizedPackageJson;

const configs = await combine(
    {
        plugins: {
            "": {
                rules: Object.fromEntries(builtinRules.entries()),
            },
        },
    },
    antfu({
        packageJson: fakePackageJson,
    }),
    bestPractices({}),
    compat({}),
    errors({}),
    html({}),
    noSecrets({}),
    noUnsanitized({}),
    playwright({}),
    promise({}),
    simpleImportSort({}),
    sonarjs({}),
    storybook({}),
    tailwindcss({}),
    tanstackQuery({}),
    tsdoc({}),
    validateJsxNesting({}),
    variables({}),
    style({}),
    comments({}),
    // formatters(),
    imports({
        packageJson: fakePackageJson,
    }),
    javascript({}),
    jsxA11y({}),
    jsdoc({
        packageJson: fakePackageJson,
    }),
    jsonc({
        packageJson: fakePackageJson,
    }),
    markdown({}),
    perfectionist({
        packageJson: fakePackageJson,
    }),
    react({
        packageJson: fakePackageJson,
    }),
    node({
        packageJson: fakePackageJson,
    }),
    // solid({),
    sortPackageJson({}),
    stylistic({}),
    // svelte({),
    vitest({}),
    toml({}),
    regexp({}),
    typescript({}),
    unicorn({
        packageJson: fakePackageJson,
    }),
    // unocss({),
    yaml({}),
);

const configNames = configs.map((i) => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
    includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", dts);
