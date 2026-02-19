import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
import type { ParserOptions } from "@typescript-eslint/parser";
import type { NormalizedPackageJson } from "@visulima/package";
import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";

import type { RuleOptions } from "./typegen";
import type { VendoredPrettierOptions } from "./vender/prettier-types";

export type Awaitable<T> = Promise<T> | T;

export interface OptionsComponentExtensions {
    /**
     * Additional extensions for components.
     * @example ['vue']
     */
    componentExts?: string[];
}

export type { ConfigNames } from "./typegen";

export interface OptionsConfig
    extends OptionsComponentExtensions, OptionsSilentConsoleLogs {
    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    antfu?: OptionsFiles & OptionsOverrides;

    /**
     * Enable ASTRO support.
     *
     * Requires installing:
     * - `eslint-plugin-astro`
     *
     * Requires installing for formatting .astro:
     * - `prettier-plugin-astro`
     * @default false
     */
    astro?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    comments?: OptionsFiles & OptionsOverrides;

    /**
     * Override the `files` option to provide custom globs.
     */
    compat?: OptionsFiles;

    /**
     * Enable CSS support.
     * @default false
     */
    css?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * The working directory for the config.
     * @default process.cwd()
     */
    cwd?: string;

    /**
     * Enable e18e rules.
     * @default true
     */
    e18e?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Use external formatters to format files.
     *
     * Requires installing:
     * - `eslint-plugin-format`
     *
     * When set to `true`, it will enable all formatters.
     * @default false
     */
    formatters?: OptionsFormatters | boolean;

    /**
     * Enable gitignore support.
     *
     * Passing an object to configure the options.
     * @see https://github.com/antfu/eslint-config-flat-gitignore
     * @default true
     */
    gitignore?: FlatGitignoreOptions | boolean;

    /**
     * Enable HTML support.
     *
     * Requires installing:
     * - `eslint-plugin-html`
     * @default false
     */
    html?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    imports?: OptionsFiles & OptionsOverrides;

    /**
     * Control to disable some rules in editors.
     * @default auto-detect based on the process.env
     */
    isInEditor?: boolean;

    /**
     * Core rules. Can't be disabled.
     */
    javascript?: OptionsOverrides;

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    jsdoc?: OptionsFiles & OptionsOverrides;

    /**
     * Enable JSONC support.
     * @default true
     */
    jsonc?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable JSX related rules.
     *
     * Currently only stylistic rules are included.
     * @default true
     */
    jsx?: boolean;

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    "jsx-a11y"?: OptionsFiles & OptionsOverrides;

    /**
     * Disable some opinionated rules to Anolilab's preference.
     *
     * Including:
     * - `antfu/top-level-function`
     * - `antfu/if-newline`
     * @default false
     */
    lessOpinionated?: boolean;

    /**
     * Enable lodash rules.
     *
     * Requires installing:
     * - `eslint-plugin-lodash`
     * @default false
     */
    lodash?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable linting for **code snippets** in Markdown.
     *
     * For formatting Markdown content, enable also `formatters.markdown`.
     * @default true
     */
    markdown?: boolean | (OptionsFiles & OptionsMarkdown & OptionsOverrides);

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    node?: OptionsFiles & OptionsOverrides;

    /**
     * Override some rules.
     */
    noSecrets?: OptionsOverrides;

    /**
     * Override some rules.
     */
    noUnsanitized?: OptionsOverrides;

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    perfectionist?: OptionsFiles & OptionsOverrides;

    /**
     * Enable playwright rules.
     *
     * Requires installing:
     * - `eslint-plugin-playwright`
     * @default false
     */
    playwright?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable pnpm support.
     * @default true
     */
    pnpm?: boolean | (OptionsOverrides & OptionsPnpm);

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    promise?: OptionsFiles & OptionsOverrides;

    /**
     * Enable react rules.
     *
     * Requires installing:
     * - `@eslint-react/eslint-plugin`
     * - `eslint-plugin-react`
     * - `eslint-plugin-react-hooks`
     * - `eslint-plugin-react-refresh`
     * - `eslint-plugin-react-perf`
     * - `eslint-plugin-react-you-might-not-need-an-effect`
     * @default false
     * Enabled this option automatically when react is installed.
     */
    react?: boolean | (OptionsFiles & OptionsOverrides & OptionsReact);

    /**
     * Enable react-compiler rules.
     *
     * Requires installing:
     * - `eslint-plugin-react-compiler`
     * @default false
     * Enabled automatically when react-compiler-runtime is installed.
     * @deprecated Use `react.compiler` instead.
     */
    reactCompiler?: boolean;

    /**
     * Enable regexp rules.
     * @see https://ota-meshi.github.io/eslint-plugin-regexp/
     * @default true
     */
    regexp?: boolean | (OptionsFiles & OptionsOverrides & OptionsRegExp);

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    simpleImportSort?: OptionsFiles & OptionsOverrides;

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    sonarjs?: OptionsFiles & OptionsOverrides;

    /**
     * Enable Storybook rules.
     *
     * Requires installing:
     * - `eslint-plugin-storybook`
     * @default false
     */
    storybook?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable stylistic rules.
     * @see https://eslint.style/
     * @default true
     */
    stylistic?: boolean | (OptionsFiles & OptionsOverrides & StylisticConfig);

    /**
     * Enable tailwindcss support.
     *
     * Requires installing:
     * - `eslint-plugin-tailwindcss`
     *
     * When set to `true`, it will enable Tailwind CSS v3 or v4 support.
     * When set to `"v4"`, it will enable Tailwind CSS v4 support.
     * When set to `{ version: "v3" }`, it will enable Tailwind CSS v3 support.
     * When set to `{ version: "v4" }`, it will enable Tailwind CSS v4 support.
     * @default false
     */
    tailwindcss?:
        | boolean
        | "v3"
        | "v4"
        | (OptionsFiles & OptionsOverrides & { version?: "v3" | "v4" });

    /**
     * Enable tanstack rules.
     *
     * Requires installing:
     * - `@tanstack/eslint-plugin-query`
     * @default false
     */
    tanstackQuery?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable tanstack rules.
     *
     * Requires installing:
     * - `@tanstack/eslint-plugin-router`
     * @default false
     */
    tanstackRouter?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable testing-library rules.
     *
     * Requires installing:
     * - `eslint-plugin-testing-library`
     * @default false
     */
    testingLibrary?:
        | boolean
        | (OptionsFiles & OptionsOverrides & OptionsPackageJson);

    /**
     * Enable TOML support.
     * @default true
     */
    toml?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable tsdoc rules.
     *
     * Requires installing:
     * - `eslint-plugin-tsdoc`
     * @default false
     */
    tsdoc?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable TypeScript support.
     *
     * Passing an object to enable TypeScript Language Server support.
     * @default auto-detect based on the dependencies
     */
    typescript?: OptionsTypescript | boolean;

    /**
     * Options for eslint-plugin-unicorn.
     * @default true
     */
    unicorn?: OptionsUnicorn | boolean;

    /**
     * Enable unocss rules.
     *
     * Requires installing:
     * - `@unocss/eslint-plugin`
     * @default false
     */
    unocss?: OptionsUnoCSS | boolean;

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    unusedImports?: OptionsFiles & OptionsOverrides;

    /**
     * Override the `files` option to provide custom globs or disable some rules.
     */
    validateJsxNesting?: OptionsFiles & OptionsOverrides;

    /**
     * Enable vitest support.
     * @default true
     */
    vitest?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable YAML support.
     * @default true
     */
    yaml?: boolean | (OptionsFiles & OptionsOverrides);

    /**
     * Enable Zod rules.
     *
     * Requires installing:
     * - `eslint-plugin-zod`
     * @default false
     */
    zod?: boolean | (OptionsFiles & OptionsOverrides);
}

export interface OptionsCwd {
    /**
     * The working directory for the config.
     * @default process.cwd()
     */
    cwd: string;
}

export interface OptionsFiles {
    /**
     * Override the `files` option to provide custom globs.
     */
    files?: string[];
}

export interface OptionsFormatters {
    /**
     * Enable formatting support for Astro.
     *
     * Currently only support Prettier.
     */
    astro?: boolean | "prettier";

    /**
     * Enable formatting support for CSS, Less, Sass, and SCSS.
     *
     * Currently only support Prettier.
     */
    css?: boolean | "prettier";

    /**
     * Custom options for dprint.
     *
     * By default it's controlled by our own config.
     */
    dprintOptions?: {
        indent?: "space" | "tab";
        indentWidth?: number;
        quoteStyle?: "preferDouble" | "preferSingle";
        useTabs?: boolean;
    };

    /**
     * Enable formatting support for GraphQL.
     */
    graphql?: boolean | "prettier";

    /**
     * Enable formatting support for HTML.
     *
     * Currently only support Prettier.
     */
    html?: boolean | "prettier";

    /**
     * Enable formatting support for Markdown.
     *
     * Support both Prettier and dprint.
     *
     * When set to `true`, it will use Prettier.
     */
    markdown?: boolean | "dprint" | "prettier";

    /**
     * Custom options for Prettier.
     *
     * By default it's controlled by our own config.
     */
    prettierOptions?: VendoredPrettierOptions;

    /**
     * Install the prettier plugin for handle Slidev markdown
     *
     * Only works when `markdown` is enabled with `prettier`.
     */
    slidev?:
        | boolean
        | {
            files?: string[];
        };

    /**
     * Enable formatting support for SVG.
     *
     * Currently only support Prettier.
     */
    svg?: boolean | "prettier";

    /**
     * Enable formatting support for XML.
     *
     * Currently only support Prettier.
     */
    xml?: boolean | "prettier";
}

export interface OptionsHasPrettier {
    prettier?: boolean;
}

export interface OptionsIsInEditor {
    isInEditor?: boolean;
}

export interface OptionsMarkdown {
    /**
     * Enable GitHub Flavored Markdown support.
     * @default true
     */
    gfm?: boolean;

    /**
     * Override rules for markdown files (not for code blocks inside markdown).
     */
    overridesMarkdown?: TypedFlatConfigItem["rules"];
}

export interface OptionsOverrides {
    overrides?: TypedFlatConfigItem["rules"];
}

export interface OptionsPnpm {
    /**
     * Requires catalogs usage
     */
    catalogs?: boolean;

    /**
     * Enable linting for package.json, will install the jsonc parser
     * @default true
     */
    json?: boolean;

    /**
     * Sort entries in pnpm-workspace.yaml
     * @default false
     */
    sort?: boolean;

    /**
     * Enable linting for pnpm-workspace.yaml, will install the yaml parser
     * @default true
     */
    yaml?: boolean;
}
export interface OptionsPackageJson {
    /**
     * The package.json object
     */
    packageJson: NormalizedPackageJson;
}

export interface OptionsRegExp {
    /**
     * Override rulelevels
     */
    level?: "error" | "warn";
}

export interface OptionsSilentConsoleLogs {
    /**
     * This option is used to enable or disable to console log information.
     */
    silent?: boolean;
}

export interface OptionsStylistic {
    stylistic?: StylisticConfig | boolean;
}

export type OptionsTypescript = OptionsOverrides
    & OptionsTypeScriptParserOptions
    & OptionsTypeScriptWithTypes;

export interface OptionsTypeScriptParserOptions {
    /**
     * Glob patterns for files that should be type aware.
     * @default ['**\/*.{ts,tsx}']
     */
    filesTypeAware?: string[];

    /**
     * Glob patterns for files that should not be type aware.
     * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
     */
    ignoresTypeAware?: string[];

    /**
     * Additional parser options for TypeScript.
     */
    parserOptions?: Partial<ParserOptions & { erasableSyntaxOnly?: boolean }>;
}

export interface OptionsTypeScriptWithTypes {
    /**
     * When this options is true, type aware rules will be enabled.
     * @see https://typescript-eslint.io/linting/typed-linting/
     * @default true
     */
    isTypeAware?: boolean;

    /**
     * Override type aware rules.
     */
    overridesTypeAware?: TypedFlatConfigItem["rules"];

    /**
     * When this options is provided, type aware rules will be enabled.
     * @see https://typescript-eslint.io/linting/typed-linting/
     */
    tsconfigPath?: string;
}

export interface OptionsReact {
    /**
     * Enable react-compiler rules.
     *
     * Requires installing:
     * - `eslint-plugin-react-compiler`
     * @default false
     * Enabled automatically when react-compiler-runtime is installed.
     */
    reactCompiler?: boolean;

    /**
     * Enable react-unhookify rules for removing useMemo, useCallback, and React.memo.
     *
     * This plugin is useful when using React Compiler which makes these hooks unnecessary.
     *
     * Requires installing:
     * - `@ospm/eslint-plugin-react-unhookify`
     * @default false
     * @see https://www.npmjs.com/package/@ospm/eslint-plugin-react-unhookify
     */
    reactUnhookify?: boolean;

    /**
     * React version to use (e.g., "18.2.0", "19.0.0").
     * If not specified, will be detected from package.json.
     */
    reactVersion?: string;
}

export interface OptionsUnicorn {
    /**
     * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by Anthony.
     * @default false
     */
    allRecommended?: boolean;
}

export interface OptionsUnoCSS extends OptionsOverrides {
    /**
     * Enable attributify support.
     * @default true
     */
    attributify?: boolean;

    /**
     * Enable strict mode by throwing errors about blocklisted classes.
     * @default false
     */
    strict?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Rules = Record<string, Linter.RuleEntry<any> | undefined>
    & RuleOptions;

export type StylisticConfig = Pick<
    StylisticCustomizeOptions,
    "indent" | "jsx" | "quotes" | "semi"
>;

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<Linter.Config, "plugins" | "rules"> & {
    /**
     * An object containing a name-value mapping of plugin names to plugin objects.
     * When `files` is specified, these plugins are only available to the matching files.
     * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins?: Record<string, any>;

    /**
     * An object containing the configured rules. When `files` or `ignores` are
     * specified, these rule configurations are only available to the matching files.
     */
    rules?: Rules;
};
