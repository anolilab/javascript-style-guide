import { hasDependency, hasDevDependency, hasFile, resolvePackage } from "@anolilab/package-json-utils";

import type { PackageRules } from "./types";
import anolilabEslintConfig from "./utils/eslint-config";

const baseConfig = ["best-practices", "errors", "style", "es6", "variables"];

// eslint-disable-next-line import/exports-last
export const internalPluginConfig = [
    "compat",
    "eslint-comments",
    "import",
    "promise",
    "simple-import-sort",
    "no-extend-native",
    "node",
    // Security Rules
    "no-secrets",
    "sonarjs",
    "security",
    "regexp",
    // file rules
    "jsonc",
    "markdown",
    "toml",
    "yml",
    "html",
    "no-loops",

    // custom rules
    "antfu",
    "unicorn",
    "es",
    "perfectionist",
];

const pluginConfig: PackageRules = [
    {
        configName: "array-func",
        dependencies: ["eslint-plugin-array-func"],
    },
    {
        configName: "jsdoc",
        dependencies: ["eslint-plugin-jsdoc"],
    },
    {
        configName: "tsdoc",
        dependencies: ["eslint-plugin-tsdoc", "typescript"],
    },
    {
        configName: "you-dont-need-lodash-underscore",
        dependencies: ["eslint-plugin-you-dont-need-lodash-underscore"],
        oneOfDependency: [
            "lodash",
            "underscore",
            "lodash-es",
            "@types/lodash",

            "lodash.chunk",
            "lodash.compact",
            "lodash.concat",
            "lodash.difference",
            "lodash.differenceby",
            "lodash.differencewith",
            "lodash.drop",
            "lodash.dropright",
            "lodash.droprightwhile",
            "lodash.dropwhile",
            "lodash.fill",
            "lodash.findindex",
            "lodash.findlastindex",
            "lodash.flatten",
            "lodash.flattendeep",
            "lodash.flattendepth",
            "lodash.frompairs",
            "lodash.head",
            "lodash.indexof",
            "lodash.initial",
            "lodash.intersection",
            "lodash.intersectionby",
            "lodash.intersectionwith",
            "lodash.join",
            "lodash.last",
            "lodash.lastindexof",
            "lodash.nth",
            "lodash.pull",
            "lodash.pullall",
            "lodash.pullallby",
            "lodash.pullallwith",
            "lodash.pullat",
            "lodash.remove",
            "lodash.reverse",
            "lodash.slice",
            "lodash.sortedindex",
            "lodash.sortedindexby",
            "lodash.sortedindexof",
            "lodash.sortedlastindex",
            "lodash.sortedlastindexby",
            "lodash.sortedlastindexof",
            "lodash.sorteduniq",
            "lodash.sorteduniqby",
            "lodash.tail",
            "lodash.take",
            "lodash.takeright",
            "lodash.takerightwhile",
            "lodash.takewhile",
            "lodash.union",
            "lodash.unionby",
            "lodash.unionwith",
            "lodash.uniq",
            "lodash.uniqby",
            "lodash.uniqwith",
            "lodash.unzip",
            "lodash.unzipwith",
            "lodash.without",
            "lodash.xor",
            "lodash.xorby",
            "lodash.xorwith",
            "lodash.zip",
            "lodash.zipobject",
            "lodash.zipobjectdeep",
            "lodash.zipwith",
            "lodash.countby",
            "lodash.every",
            "lodash.filter",
            "lodash.find",
            "lodash.findlast",
            "lodash.flatmap",
            "lodash.flatmapdeep",
            "lodash.flatmapdepth",
            "lodash.foreach",
            "lodash.foreachright",
            "lodash.groupby",
            "lodash.includes",
            "lodash.invokemap",
            "lodash.keyby",
            "lodash.map",
            "lodash.orderby",
            "lodash.partition",
            "lodash.reduce",
            "lodash.reduceright",
            "lodash.reject",
            "lodash.sample",
            "lodash.samplesize",
            "lodash.shuffle",
            "lodash.size",
            "lodash.some",
            "lodash.sortby",
            "lodash.now",
            "lodash.after",
            "lodash.ary",
            "lodash.before",
            "lodash.bind",
            "lodash.bindkey",
            "lodash.curry",
            "lodash.curryright",
            "lodash.debounce",
            "lodash.defer",
            "lodash.delay",
            "lodash.flip",
            "lodash.memoize",
            "lodash.negate",
            "lodash.once",
            "lodash.overargs",
            "lodash.partial",
            "lodash.partialright",
            "lodash.rearg",
            "lodash.rest",
            "lodash.spread",
            "lodash.throttle",
            "lodash.unary",
            "lodash.wrap",
            "lodash.castarray",
            "lodash.clone",
            "lodash.clonedeep",
            "lodash.clonedeepwith",
            "lodash.clonewith",
            "lodash.conformsto",
            "lodash.eq",
            "lodash.gt",
            "lodash.gte",
            "lodash.isarguments",
            "lodash.isarray",
            "lodash.isarraybuffer",
            "lodash.isarraylike",
            "lodash.isarraylikeobject",
            "lodash.isboolean",
            "lodash.isbuffer",
            "lodash.isdate",
            "lodash.iselement",
            "lodash.isempty",
            "lodash.isequal",
            "lodash.isequalwith",
            "lodash.iserror",
            "lodash.isfinite",
            "lodash.isfunction",
            "lodash.isinteger",
            "lodash.islength",
            "lodash.ismap",
            "lodash.ismatch",
            "lodash.ismatchwith",
            "lodash.isnan",
            "lodash.isnative",
            "lodash.isnil",
            "lodash.isnull",
            "lodash.isnumber",
            "lodash.isobject",
            "lodash.isobjectlike",
            "lodash.isplainobject",
            "lodash.isregexp",
            "lodash.issafeinteger",
            "lodash.isset",
            "lodash.isstring",
            "lodash.issymbol",
            "lodash.istypedarray",
            "lodash.isundefined",
            "lodash.isweakmap",
            "lodash.isweakset",
            "lodash.lt",
            "lodash.lte",
            "lodash.toarray",
            "lodash.tofinite",
            "lodash.tointeger",
            "lodash.tolength",
            "lodash.tonumber",
            "lodash.toplainobject",
            "lodash.tosafeinteger",
            "lodash.tostring",
            "lodash.add",
            "lodash.ceil",
            "lodash.divide",
            "lodash.floor",
            "lodash.max",
            "lodash.maxby",
            "lodash.mean",
            "lodash.meanby",
            "lodash.min",
            "lodash.minby",
            "lodash.multiply",
            "lodash.round",
            "lodash.subtract",
            "lodash.sum",
            "lodash.sumby",
            "lodash.clamp",
            "lodash.inrange",
            "lodash.random",
            "lodash.assign",
            "lodash.assignin",
            "lodash.assigninwith",
            "lodash.assignwith",
            "lodash.at",
            "lodash.create",
            "lodash.defaults",
            "lodash.defaultsdeep",
            "lodash.findkey",
            "lodash.findlastkey",
            "lodash.forin",
            "lodash.forinright",
            "lodash.forown",
            "lodash.forownright",
            "lodash.functions",
            "lodash.functionsin",
            "lodash.get",
            "lodash.has",
            "lodash.hasin",
            "lodash.invert",
            "lodash.invertby",
            "lodash.invoke",
            "lodash.keys",
            "lodash.keysin",
            "lodash.mapkeys",
            "lodash.mapvalues",
            "lodash.merge",
            "lodash.mergewith",
            "lodash.omit",
            "lodash.omitby",
            "lodash.pick",
            "lodash.pickby",
            "lodash.result",
            "lodash.set",
            "lodash.setwith",
            "lodash.topairs",
            "lodash.topairsin",
            "lodash.transform",
            "lodash.unset",
            "lodash.update",
            "lodash.updatewith",
            "lodash.values",
            "lodash.valuesin",
            "lodash.chain",
            "lodash.tap",
            "lodash.thru",
            "lodash.camelcase",
            "lodash.capitalize",
            "lodash.deburr",
            "lodash.endswith",
            "lodash.escape",
            "lodash.escaperegexp",
            "lodash.kebabcase",
            "lodash.lowercase",
            "lodash.lowerfirst",
            "lodash.pad",
            "lodash.padend",
            "lodash.padstart",
            "lodash.parseint",
            "lodash.repeat",
            "lodash.replace",
            "lodash.snakecase",
            "lodash.split",
            "lodash.startcase",
            "lodash.startswith",
            "lodash.template",
            "lodash.tolower",
            "lodash.toupper",
            "lodash.trim",
            "lodash.trimend",
            "lodash.trimstart",
            "lodash.truncate",
            "lodash.unescape",
            "lodash.uppercase",
            "lodash.upperfirst",
            "lodash.words",
            "lodash.attempt",
            "lodash.bindall",
            "lodash.cond",
            "lodash.conforms",
            "lodash.constant",
            "lodash.defaultto",
            "lodash.flow",
            "lodash.flowright",
            "lodash.identity",
            "lodash.iteratee",
            "lodash.matches",
            "lodash.matchesproperty",
            "lodash.method",
            "lodash.methodof",
            "lodash.mixin",
            "lodash.noconflict",
            "lodash.noop",
            "lodash.ntharg",
            "lodash.over",
            "lodash.overevery",
            "lodash.oversome",
            "lodash.property",
            "lodash.propertyof",
            "lodash.range",
            "lodash.rangeright",
            "lodash.runincontext",
            "lodash.stubarray",
            "lodash.stubfalse",
            "lodash.stubobject",
            "lodash.stubstring",
            "lodash.stubtrue",
            "lodash.times",
            "lodash.topath",
            "lodash.uniqueid",
        ],
    },
    {
        configName: "mdx",
        dependencies: ["eslint-plugin-mdx"],
        oneOfDependency: ["nextra", "docz", "@docusaurus/core", "gatsby-plugin-mdx"],
        resolve: ["@mdx-js/mdx", "remark-mdx", "@mdx-js/loader", "@mdx-js/rollup", "@mdx-js/react"],
    },
    {
        configName: "no-unsanitized",
        dependencies: ["eslint-plugin-no-unsanitized"],
    },
    {
        configName: "react",
        dependencies: ["react", "react-dom", "eslint-plugin-react"],
    },
    {
        configName: "validate-jsx-nesting",
        dependencies: ["eslint-plugin-validate-jsx-nesting"],
        oneOfDependency: ["react", "react-dom", "preact", "preact/compat"],
    },
    {
        configName: "ssr-friendly",
        dependencies: ["eslint-plugin-ssr-friendly"],
        oneOfDependency: ["react", "react-dom", "preact", "preact/compat"],
    },
    {
        configName: "react-redux",
        dependencies: ["eslint-plugin-react-redux"],
        oneOfDependency: ["@reduxjs/toolkit", "redux"],
    },
    {
        configName: "jsx-a11y",
        dependencies: ["eslint-plugin-jsx-a11y"],
        oneOfDependency: ["react", "react-dom", "preact", "preact/compat"],
    },
    {
        configName: "react-hooks",
        dependencies: ["eslint-plugin-react-hooks"],
        oneOfDependency: ["react", "react-dom", "preact", "preact/compat"],
    },
    {
        configName: "react-usememo",
        dependencies: ["@arthurgeron/eslint-plugin-react-usememo"],
        oneOfDependency: ["react", "react-dom", "preact", "preact/compat"],
    },
    {
        configName: "you-dont-need-momentjs",
        dependencies: ["moment", "eslint-plugin-you-dont-need-momentjs"],
    },
    {
        configName: "you-dont-need-momentjs",
        dependencies: ["moment-timezone", "eslint-plugin-you-dont-need-momentjs"],
    },
    {
        configName: "tailwindcss",
        dependencies: ["eslint-plugin-tailwindcss"],
        oneOfDependency: ["tailwindcss", "@tailwindcss/typography", "@tailwindcss/forms", "@tailwindcss/aspect-ratio", "@tailwindcss/line-clamp"],
    },
    {
        configName: "cypress",
        dependencies: ["cypress", "eslint-plugin-cypress"],
    },
    {
        configName: "jest",
        dependencies: ["jest", "eslint-plugin-jest"],
    },
    {
        configName: "jest-dom",
        dependencies: ["jest", "@testing-library/jest-dom", "eslint-plugin-jest-dom"],
    },
    {
        configName: "jest-async",
        dependencies: ["jest", "eslint-plugin-jest-async"],
    },
    {
        configName: "jest-formatting",
        dependencies: ["jest", "eslint-plugin-jest-formatting"],
    },
    {
        configName: "tailwindcss",
        dependencies: ["tailwindcss"],
    },
    {
        configName: "testing-library-dom",
        dependencies: ["@testing-library/dom", "eslint-plugin-testing-library"],
    },
    {
        configName: "testing-library-react",
        dependencies: ["react", "@testing-library/react", "eslint-plugin-testing-library"],
    },
    {
        configName: "typescript",
        dependencies: ["typescript"],
        files: ["tsconfig.json", "tsconfig.eslint.json"],
    },
    {
        configName: "deprecation",
        dependencies: ["typescript"],
        files: ["tsconfig.json", "tsconfig.eslint.json"],
    },
    {
        configName: "no-only-tests",
        dependencies: [],
        oneOfDependency: ["jest", "mocha", "jasmine", "tape", "ava", "qunit", "cypress"],
    },
    {
        configName: "etc",
        dependencies: ["typescript", "eslint-plugin-etc"],
    },
    {
        configName: "vitest",
        dependencies: ["vitest", "eslint-plugin-vitest"],
    },
    {
        configName: "vitest",
        dependencies: ["vitest", "eslint-plugin-vitest", "eslint-plugin-vitest-globals"],
    },
    {
        configName: "zod",
        dependencies: ["zod", "eslint-plugin-zod"],
    },
    {
        configName: "ava",
        dependencies: ["ava", "eslint-plugin-ava"],
    },
    {
        configName: "editorconfig",
        dependencies: ["eslint-plugin-editorconfig"],
        files: [".editorconfig"],
    },
    {
        configName: "storybook",
        dependencies: ["storybook", "eslint-plugin-storybook"],
    },
    {
        configName: "playwright",
        dependencies: ["playwright", "eslint-plugin-playwright"],
    },
    {
        configName: "tanstack-query",
        dependencies: ["@tanstack/react-query", "@tanstack/eslint-plugin-query"],
    },
];

const loadedPlugins: string[] = [...internalPluginConfig];
const possiblePlugins: Record<string, Record<string, boolean>> = {};

if (loadedPlugins.length === internalPluginConfig.length) {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    pluginConfig.forEach((plugin) => {
        const { configName, dependencies } = plugin;

        // eslint-disable-next-line security/detect-object-injection
        if ((anolilabEslintConfig as unknown as Record<string, Record<string, false | undefined>>)["plugin"]?.[configName] !== false) {
            const foundDependencies = [];

            dependencies.forEach((dependency) => {
                if (hasDependency(dependency) || hasDevDependency(dependency)) {
                    foundDependencies.push(dependency);
                }
            });

            // eslint-disable-next-line security/detect-object-injection
            possiblePlugins[configName] = {};

            if (foundDependencies.length === 0) {
                if (plugin.oneOfDependency !== undefined) {
                    let foundOneOfDependency = false;

                    plugin.oneOfDependency.forEach((dependency) => {
                        if (!foundOneOfDependency && (hasDependency(dependency) || hasDevDependency(dependency))) {
                            foundOneOfDependency = true;

                            // eslint-disable-next-line security/detect-object-injection
                            (possiblePlugins[configName] as Record<string, boolean>)[dependency] = true;
                        }
                    });
                }

                if (plugin.resolve !== undefined) {
                    plugin.resolve.forEach((rdependency) => {
                        if (resolvePackage(rdependency) !== undefined) {
                            // eslint-disable-next-line security/detect-object-injection
                            (possiblePlugins[configName] as Record<string, boolean>)[rdependency] = true;
                        }
                    });
                }

                if (plugin.files !== undefined) {
                    plugin.files.forEach((file) => {
                        if (hasFile(file)) {
                            // eslint-disable-next-line security/detect-object-injection
                            (possiblePlugins[configName] as Record<string, boolean>)[file] = true;
                        }
                    });
                }
            }

            if (foundDependencies.length === dependencies.length) {
                // eslint-disable-next-line security/detect-object-injection,@typescript-eslint/no-dynamic-delete
                delete possiblePlugins[configName];

                loadedPlugins.push(configName);
            } else {
                dependencies.forEach((dependency) => {
                    // eslint-disable-next-line security/detect-object-injection
                    (possiblePlugins[configName] as Record<string, boolean>)[dependency] = hasDependency(dependency) || hasDevDependency(dependency);
                });
            }
        }
    });
}

export const rules = baseConfig;
export const pluginRules = loadedPlugins;

export const possiblePluginRules = possiblePlugins;
