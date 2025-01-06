import fs from "node:fs/promises";

import type { NormalizedPackageJson } from "@visulima/package";
import { builtinRules } from "eslint/use-at-your-own-risk";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";

import bestPractices from "../src/config/best-practices";
import errors from "../src/config/errors";
import antfu from "../src/config/plugins/antfu";
import astro from "../src/config/plugins/astro";
import comments from "../src/config/plugins/comments";
import compat from "../src/config/plugins/compat";
import formatters from "../src/config/plugins/formatters";
import html from "../src/config/plugins/html";
import imports from "../src/config/plugins/imports";
import javascript from "../src/config/plugins/javascript";
import jsdoc from "../src/config/plugins/jsdoc";
import jsonc from "../src/config/plugins/jsonc";
import jsxA11y from "../src/config/plugins/jsx-a11y";
import markdown from "../src/config/plugins/markdown";
import noSecrets from "../src/config/plugins/no-secrets";
import noUnsanitized from "../src/config/plugins/no-unsanitized";
import node from "../src/config/plugins/node";
import perfectionist from "../src/config/plugins/perfectionist";
import playwright from "../src/config/plugins/playwright";
import promise from "../src/config/plugins/promise";
import react from "../src/config/plugins/react";
import regexp from "../src/config/plugins/regexp";
import simpleImportSort from "../src/config/plugins/simple-import-sort";
import sonarjs from "../src/config/plugins/sonarjs";
import storybook from "../src/config/plugins/storybook";
import stylistic from "../src/config/plugins/stylistic";
import tailwindcss from "../src/config/plugins/tailwindcss";
import tanstackQuery from "../src/config/plugins/tanstack-query";
import tanstackRouter from "../src/config/plugins/tanstack-router";
import testingLibrary from "../src/config/plugins/testing-library";
import toml from "../src/config/plugins/toml";
import tsdoc from "../src/config/plugins/tsdoc";
import typescript from "../src/config/plugins/typescript";
import unicorn from "../src/config/plugins/unicorn";
import unocss from "../src/config/plugins/unocss";
import validateJsxNesting from "../src/config/plugins/validate-jsx-nesting";
import vitest from "../src/config/plugins/vitest";
import yaml from "../src/config/plugins/yml";
import youDontNeedLodashUnderscore from "../src/config/plugins/you-dont-need-lodash-underscore";
import zod from "../src/config/plugins/zod";
import style from "../src/config/style";
import variables from "../src/config/variables";
import combine from "../src/utils/combine";

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
    astro({}),
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
    tanstackRouter({}),
    tsdoc({}),
    validateJsxNesting({}),
    variables({}),
    style({}),
    comments({}),
    formatters({}, {}),
    imports({
        cwd: "",
        packageJson: fakePackageJson,
    }),
    javascript({
        packageJson: fakePackageJson,
    }),
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
    youDontNeedLodashUnderscore({}),
    stylistic({}),
    vitest({}),
    toml({}),
    regexp({}),
    typescript({}),
    unicorn({
        packageJson: fakePackageJson,
    }),
    testingLibrary({
        packageJson: fakePackageJson,
    }),
    unocss({}),
    yaml({}),
    zod({}),
);

const configNames = configs.map(index => index.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
    includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", dts);
