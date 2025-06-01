<div align="center">

<h1>Shareable ESLint config</h1>

[![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

</div>

---

<div align="center">
    <p>
        <sup>
            Daniel Bannert's open source work is supported by the community on <a href="https://github.com/sponsors/prisis">GitHub Sponsors</a>
        </sup>
    </p>
</div>

---

## Purpose

Our package serves as a valuable resource for JavaScript/Typescript-based projects, offering composable [ESLint](https://eslint.org/) configurations. It encompasses a range of features, including performance optimization and the flexibility to extend pre-defined base configurations. We aim to provide a strong, opinionated foundation for code quality and consistency, while still allowing for customization to suit specific project needs.

- Tailored Configuration for Workspaces: With this package, each workspace within your monorepo gains the ability to have its own customized ESLint configuration. This ensures that individual projects can maintain their specific requirements while still adhering to the overall guidelines.
- Configurability at Your Fingertips: Crafting your workspace's ESLint configuration is a breeze, thanks to the seamless composition of pre-defined base configurations. This empowers you to tailor the settings to suit your project's unique needs, without starting from scratch.

- Enhanced Efficiency: We've optimized the package's performance by intelligently enabling plugins based on file naming conventions and project dependencies. This streamlined approach ensures that your ESLint checks run efficiently, targeting the relevant files and maximizing productivity.

> [!NOTE]
> Since v16.0.0, this config is rewritten to the new [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new).
>
> ESLint v9.5.0+ is now required.

> [!WARNING]
>
> Please keep in mind that this is still **_a personal config_** with a lot of opinions. Changes might not always work for everyone and every use case.
>
> If you are using this config directly, I suggest you **review the changes every time you update**. Or if you want more control over the rules, always feel free to fork it. Thanks!

## Highlights

- Zero-config for many common setups, but highly configurable when needed.
- Enforces readable and consistent code, because you read more code than you write.
- Lints a wide range of files, including JavaScript, TypeScript, JSON, YAML, Markdown, and more.
- No need to specify file paths to lint as it intelligently lints relevant files, respecting `.gitignore` and common ignore patterns.
- Config overrides per files/globs.
- First-class TypeScript support, automatically enabled if `typescript` is detected in your project.
- Includes a comprehensive set of ESLint plugins, like [unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn), [import](https://github.com/benmosher/eslint-plugin-import), [sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs), and [security](#security) plugins. (See more under [Plugins](#plugins)).
- Automatically enables relevant rules based on the [engines](https://docs.npmjs.com/files/package.json#engines) field in your `package.json`.
- Easily configure stylistic preferences like indent and semicolon without deep diving into rule configurations.
- Works alongside Prettier: Our configuration disables ESLint rules that would conflict with Prettier, allowing ESLint to focus on code quality and Prettier on formatting if you choose to use both. However, many stylistic rules are included and can be enforced by ESLint directly.

## Install

To install this config, run the following command.

```bash
npm install --save-dev eslint @anolilab/eslint-config
```

```sh
pnpm add -D eslint @anolilab/eslint-config
```

```sh
yarn add -D eslint @anolilab/eslint-config
```

## Usage

Our default export is designed to be used within ESLint's flat configuration system (e.g., `eslint.config.js`). It contains a comprehensive set of ESLint rules, suitable for modern ECMAScript (ES2021+ by default) and TypeScript projects.

To use it, import the `createConfig` function from `@anolilab/eslint-config` into your `eslint.config.js` (or `eslint.config.mjs`). This function allows you to generate the configuration, optionally with your own settings.

Create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import type { PromiseFlatConfigComposer } from "@anolilab/eslint-config";
import { createConfig } from "@anolilab/eslint-config";

export default createConfig() as PromiseFlatConfigComposer;
```

<details>
<summary>
Combined with legacy config:
</summary>

If you still use some configs from the legacy eslintrc format, you can use the [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) package to convert them to the flat config.

```js
// eslint.config.mjs
import type { PromiseFlatConfigComposer } from "@anolilab/eslint-config";
import { createConfig } from "@anolilab/eslint-config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default createConfig(
    {
        ignores: [],
    },

    // Legacy config
    ...compat.config({
        extends: [
            "eslint:recommended",
            // Other extends...
        ],
    }),

    // Other flat configs...
) as PromiseFlatConfigComposer;
```

> Note that `.eslintignore` no longer works in Flat config.

</details>

Or you can configure each integration individually, for example:

```js
// eslint.config.js
import type { PromiseFlatConfigComposer } from "@anolilab/eslint-config";
import { createConfig } from "@anolilab/eslint-config";

export default createConfig({
    // Enable stylistic formatting rules
    // stylistic: true,

    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    ignores: [
        "**/fixtures",
        // ...globs
    ],

    // Disable jsonc and yaml support
    jsonc: false,
    // Or customize the stylistic rules
    stylistic: {
        indent: 2, // 4, or 'tab'
        quotes: "single", // or 'double'
    },

    // TypeScript and Vue are autodetected, you can also explicitly enable them:
    typescript: true,
    vue: true,

    yaml: false,
}) as PromiseFlatConfigComposer;
```

### Add script for package.json

For example:

```json
{
    "scripts": {
        "lint": "eslint .",
        "lint:fix": "eslint . --fix"
    }
}
```

The factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import type { PromiseFlatConfigComposer } from "@anolilab/eslint-config";
import { createConfig } from "@anolilab/eslint-config";

export default createConfig(
    {
        // Configures for anolilab's config
    },

    // From the second arguments they are ESLint Flat Configs
    // you can have multiple configs
    {
        files: ["**/*.ts"],
        rules: {},
    },
    {
        rules: {},
    },
) as PromiseFlatConfigComposer;
```

We also provided the `overrides` options in each integration to make it easier:

```js
// eslint.config.js
import type { PromiseFlatConfigComposer } from "@anolilab/eslint-config";
import { createConfig } from "@anolilab/eslint-config";

export default createConfig({
    typescript: {
        overrides: {
            "ts/consistent-type-definitions": ["error", "interface"],
        },
    },
    yaml: {
        overrides: {
            // ...
        },
    },
}) as PromiseFlatConfigComposer;
```

## IDE Support (auto fix on save)

<details>
<summary>🟦 VS Code support</summary>

<br>

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
    // Disable the default formatter, use eslint instead
    "prettier.enable": false,
    "editor.formatOnSave": false,

    // Auto fix
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
        "source.organizeImports": "never"
    },

    // Silent the stylistic rules in you IDE, but still auto fix them
    "eslint.rules.customizations": [
        { "rule": "style/*", "severity": "off", "fixable": true },
        { "rule": "format/*", "severity": "off", "fixable": true },
        { "rule": "*-indent", "severity": "off", "fixable": true },
        { "rule": "*-spacing", "severity": "off", "fixable": true },
        { "rule": "*-spaces", "severity": "off", "fixable": true },
        { "rule": "*-order", "severity": "off", "fixable": true },
        { "rule": "*-dangle", "severity": "off", "fixable": true },
        { "rule": "*-newline", "severity": "off", "fixable": true },
        { "rule": "*quotes", "severity": "off", "fixable": true },
        { "rule": "*semi", "severity": "off", "fixable": true }
    ],

    // Enable eslint for all supported languages
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "vue",
        "html",
        "markdown",
        "json",
        "jsonc",
        "yaml",
        "toml",
        "xml",
        "gql",
        "graphql",
        "astro",
        "svelte",
        "css",
        "less",
        "scss",
        "pcss",
        "postcss"
    ]
}
```

</details>

<details>
<summary>🟩 Neovim Support</summary>

<br>

Update your configuration to use the following:

```lua
local customizations = {
  { rule = 'style/*', severity = 'off', fixable = true },
  { rule = 'format/*', severity = 'off', fixable = true },
  { rule = '*-indent', severity = 'off', fixable = true },
  { rule = '*-spacing', severity = 'off', fixable = true },
  { rule = '*-spaces', severity = 'off', fixable = true },
  { rule = '*-order', severity = 'off', fixable = true },
  { rule = '*-dangle', severity = 'off', fixable = true },
  { rule = '*-newline', severity = 'off', fixable = true },
  { rule = '*quotes', severity = 'off', fixable = true },
  { rule = '*semi', severity = 'off', fixable = true },
}

local lspconfig = require('lspconfig')
-- Enable eslint for all supported languages
lspconfig.eslint.setup(
  {
    filetypes = {
      "javascript",
      "javascriptreact",
      "javascript.jsx",
      "typescript",
      "typescriptreact",
      "typescript.tsx",
      "vue",
      "html",
      "markdown",
      "json",
      "jsonc",
      "yaml",
      "toml",
      "xml",
      "gql",
      "graphql",
      "astro",
      "svelte",
      "css",
      "less",
      "scss",
      "pcss",
      "postcss"
    },
    settings = {
      -- Silent the stylistic rules in you IDE, but still auto fix them
      rulesCustomizations = customizations,
    },
  }
)
```

### Neovim format on save

There's few ways you can achieve format on save in neovim:

- `nvim-lspconfig` has a `EslintFixAll` command predefined, you can create a autocmd to call this command after saving file.

```lua
lspconfig.eslint.setup({
  --- ...
  on_attach = function(client, bufnr)
    vim.api.nvim_create_autocmd("BufWritePre", {
      buffer = bufnr,
      command = "EslintFixAll",
    })
  end,
})
```

- Use [conform.nvim](https://github.com/stevearc/conform.nvim).
- Use [none-ls](https://github.com/nvimtools/none-ls.nvim)
- Use [nvim-lint](https://github.com/mfussenegger/nvim-lint)

</details>

### Using `getFilesGlobs` for Common File Types

Your `@anolilab/eslint-config` package also exports a handy utility function `getFilesGlobs` that provides pre-defined glob patterns for common file types. This can simplify targeting specific sets of files in your ESLint configuration objects.

You can import it alongside `createConfig`:

```javascript
// eslint.config.js
import { createConfig, getFilesGlobs } from "@anolilab/eslint-config";

const baseConfig = createConfig();

// Get glob patterns for all JavaScript and TypeScript files
const jsTsFiles = getFilesGlobs("js_and_ts");
// Get glob patterns for Markdown files
const markdownFiles = getFilesGlobs("markdown");
// Get glob patterns for HTML related files
const htmlFiles = getFilesGlobs("html");

export default [
    ...baseConfig,
    {
        files: jsTsFiles,
        // languageOptions, rules, etc., specific to JS and TS files
        rules: {
            // 'your-rule/for-js-ts': 'error',
        },
    },
    {
        files: markdownFiles,
        // languageOptions, rules, etc., specific to Markdown files
        // Often, you might use a specific processor or plugin for Markdown here
        // processor: markdownProcessor, // Fictional example
        // plugins: { markdownPlugin } // Fictional example
    },
    {
        files: htmlFiles,
        // languageOptions, rules, etc., specific to HTML files
    },
    // ... other configurations
];
```

### Type Aware Rules

You can optionally enable the [type aware](https://typescript-eslint.io/linting/typed-linting/) rules by passing the options object to the `typescript` config:

```js
// eslint.config.js
import type { PromiseFlatConfigComposer } from "@anolilab/eslint-config";
import { createConfig } from "@anolilab/eslint-config";

export default createConfig({
    typescript: {
        tsconfigPath: "tsconfig.json",
    },
}) as PromiseFlatConfigComposer;
```

### Utilities

The `getFilesGlobs` function accepts one of the following `FileType` strings:

- `"all"`: All JavaScript, TypeScript, and declaration files.
- `"astro_ts"`: TypeScript files within Astro components.
- `"astro"`: Astro component files (`.astro`).
- `"css"`: CSS files.
- `"types"`: TypeScript declaration files (`.d.ts`, `.d.cts`, `.d.mts`).
- `"e2e"`: End-to-end test files.
- `"graphql"`: GraphQL files (`.gql`, `.graphql`).
- `"html"`: Various HTML-like template files (`.html`, `.hbs`, `.erb`, etc.).
- `"js_and_ts"`: All JavaScript and TypeScript source files (excluding declarations).
- `"js"`: JavaScript files (`.js`, `.mjs`, `.cjs`).
- `"jsx_and_tsx"`: JSX and TSX files.
- `"less"`: LESS files.
- `"markdown_in_markdown"`: Markdown files embedded within other Markdown files.
- `"markdown_inline_js_jsx"`: JS/JSX code blocks within Markdown.
- `"markdown"`: Markdown files (`.md`, `.mkdn`, etc.).
- `"postcss"`: PostCSS configuration files.
- `"scss"`: SCSS files.
- `"storybook"`: Storybook story files.
- `"svg"`: SVG files.
- `"toml"`: TOML files.
- `"ts"`: All TypeScript files including declarations and TSX (`.ts`, `.tsx`, `.d.ts`, etc.).
- `"vitest"`: Vitest test files.
- `"xml"`: XML files.
- `"yaml"`: YAML files (`.yaml`, `.yml`).

Using `getFilesGlobs` can make your configuration more readable and maintainable by abstracting away the specific glob patterns.

## Plugins

Our configuration integrates a wide array of ESLint plugins to cover various aspects of code quality, language support, security, and specific libraries/frameworks. Many of these are enabled automatically when relevant dependencies are detected in your project.

### Core & Code Quality

These plugins form the backbone of our linting rules, focusing on best practices, consistency, and potential errors.

- **[@eslint/js](https://www.npmjs.com/package/@eslint/js)**: Core ESLint rules.
- **[eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)**: Various awesome ESLint rules.
- **[eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)**: Rules to detect bugs and code smells.
- **[eslint-plugin-promise](https://github.com/eslint-community/eslint-plugin-promise)**: Enforce best practices for JavaScript promises.
- **[eslint-plugin-es-x](https://github.com/eslint-community/eslint-plugin-es-x)** (formerly `eslint-plugin-es`): Prevent ES6+ syntax from being used in ES5 environments.
- **[eslint-plugin-antfu](https://github.com/antfu/eslint-config)**: Opinionated linting rules by Anthony Fu.
- **[eslint-plugin-perfectionist](https://github.com/azat-io/eslint-plugin-perfectionist)**: Rules for sorting and ordering various data structures.
- **[eslint-plugin-no-for-of-array](https://github.com/smelukov/eslint-plugin-no-for-of-array)**: Disallow `for...of` loops on arrays (promoting array methods).
- **[eslint-plugin-unused-imports](https://github.com/sweepline/eslint-plugin-unused-imports)**: Find and remove unused ES6 imports.

### Stylistic & Formatting

These plugins help maintain a consistent code style. Note that while these are included, you can also use Prettier for formatting, and our config is designed to be compatible.

- **[@stylistic/eslint-plugin](https://eslint.style/packages/default)** (and `@stylistic/eslint-plugin-ts`): ESLint Stylistic, for all stylistic rules.
- **[eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)**: Easy import sorting.
- **[eslint-plugin-format](https://github.com/antfu/eslint-plugin-format)**: Enables formatting of various file types using Prettier or other formatters via ESLint.

### Language Support & Syntax

Plugins for specific languages or syntaxes beyond standard JavaScript/TypeScript.

- **[@typescript-eslint/eslint-plugin](https://typescript-eslint.io/)**: The tooling that enables ESLint to lint TypeScript code.
- **[eslint-plugin-jsonc](https://github.com/ota-meshi/eslint-plugin-jsonc)**: ESLint plugin for JSON, JSONC, and JSON5 files.
- **[eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)**: ESLint plugin for YAML files.
- **[eslint-plugin-toml](https://github.com/ota-meshi/eslint-plugin-toml)**: ESLint plugin for TOML files.
- **[eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html)**: An ESLint plugin to extract and lint script tags from HTML files.
- **[@html-eslint/eslint-plugin](https://html-eslint.org/)**: Alternative ESLint plugin for HTML files.
- **[@eslint/markdown](https://www.npmjs.com/package/@eslint/markdown)**: Lint JavaScript code blocks in Markdown documents.
- **[eslint-plugin-astro](https://github.com/ota-meshi/eslint-plugin-astro)**: ESLint plugin for Astro components.

### Import & Module System

Managing imports and module structure.

- **[eslint-plugin-import-x](https://github.com/un-es/eslint-plugin-import-x)** (formerly `eslint-plugin-import`): Linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names.
    - Uses `eslint-import-resolver-node` and `eslint-import-resolver-typescript`.
- **[eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)** (formerly `eslint-plugin-node`): Additional ESLint rules for Node.js.

### Security

Plugins focused on identifying potential security vulnerabilities.

- **[eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security)**: ESLint rules for Node Security.
- **[eslint-plugin-no-secrets](https://github.com/nickdeis/eslint-plugin-no-secrets)**: An ESLint plugin that detects potential secrets/credentials.
- **[eslint-plugin-no-unsanitized](https://github.com/mozilla/eslint-plugin-no-unsanitized)**: ESLint plugin for security related rules regarding untrusted input.

### Testing

Plugins for various testing frameworks and practices.

- **[eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)**: Disallow `.only` calls in test files.
- **[eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library)**: ESLint plugin for Testing Library.
- **[eslint-plugin-playwright](https://github.com/playwright-community/eslint-plugin-playwright)**: ESLint plugin for Playwright.

### Frameworks & Libraries

Support for specific UI frameworks, libraries, and tools.

- **[@eslint-react/eslint-plugin](https://github.com/AriPerkkio/eslint-react)**: A comprehensive ESLint plugin for React.
- **[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)**: ESLint rules for React Hooks.
- **[eslint-plugin-react-refresh](https://www.npmjs.com/package/eslint-plugin-react-refresh)**: Enforces best practices for React Fast Refresh.
- **[eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)**: Static AST checker for accessibility rules on JSX elements.
- **[eslint-plugin-validate-jsx-nesting](https://github.com/TitTat/eslint-plugin-validate-jsx-nesting)**: Validate JSX element nesting.
- **[eslint-plugin-tailwindcss](https://github.com/francoismassart/eslint-plugin-tailwindcss)**: ESLint plugin for Tailwind CSS.
- **[eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)**: Best practice rules for Storybook.
- **[@tanstack/eslint-plugin-query](https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query)**: ESLint rules for TanStack Query.
- **[@tanstack/eslint-plugin-router](https://tanstack.com/router/latest/docs/eslint/eslint-plugin-router)**: ESLint rules for TanStack Router.
- **[@unocss/eslint-plugin](https://github.com/unocss/unocss/tree/main/packages/eslint-plugin)**: ESLint plugin for UnoCSS.
- **[eslint-plugin-zod](https://github.com/IsaacScript/eslint-plugin-zod)**: ESLint rules for Zod schemas.
- **[eslint-plugin-you-dont-need-lodash-underscore](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)**: Encourages use of native JavaScript methods over Lodash/Underscore.

### Documentation & Comments

- **[@eslint-community/eslint-plugin-eslint-comments](https://github.com/eslint-community/eslint-plugin-eslint-comments)** (formerly `eslint-plugin-eslint-comments`): Additional ESLint rules for ESLint directive comments (`/*eslint-...*/`).
- **[eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc)**: JSDoc specific linting rules.
- **[eslint-plugin-tsdoc](https://github.com/microsoft/tsdoc/tree/main/eslint-plugin)**: TSDoc specific linting rules.

### Compatibility & Others

- **[eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)**: Lint the browser compatibility of your code.
- **[eslint-config-flat-gitignore](https://github.com/antfu/eslint-config-flat-gitignore)**: Utility to use .gitignore in flat config.
- **[eslint-flat-config-utils](https://github.com/antfu/eslint-flat-config-utils)**: Utilities for working with ESLint flat config.
- **[eslint-merge-processors](https://github.com/eslint/eslint-merge-processors)**: Utility to merge ESLint processors.
- **[@eslint/compat](https://www.npmjs.com/package/@eslint/compat)**: Utilities for compatibility between ESLint flat config and eslintrc.

---

### List of Used Plugins (Condensed)

This list is a more condensed version and might not be exhaustive if some plugins are very specific or utility-based. It aims to provide a quick overview of the primary active linting plugins.

- `@eslint/js`
- `@stylistic/eslint-plugin`
- `@typescript-eslint/eslint-plugin`
- `@eslint-community/eslint-plugin-eslint-comments`
- `@eslint-react/eslint-plugin`
- `@tanstack/eslint-plugin-query`
- `@tanstack/eslint-plugin-router`
- `@unocss/eslint-plugin`
- `eslint-plugin-antfu`
- `eslint-plugin-astro`
- `eslint-plugin-compat`
- `eslint-plugin-es-x`
- `eslint-plugin-format`
- `eslint-plugin-html` (or `@html-eslint/eslint-plugin`)
- `eslint-plugin-import-x`
- `eslint-plugin-jsdoc`
- `eslint-plugin-jsonc`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-n`
- `eslint-plugin-no-only-tests`
- `eslint-plugin-no-secrets`
- `eslint-plugin-no-unsanitized`
- `eslint-plugin-perfectionist`
- `eslint-plugin-playwright`
- `eslint-plugin-promise`
- `eslint-plugin-react-hooks`
- `eslint-plugin-regexp` (often a dependency of other plugins like SonarJS)
- `eslint-plugin-security`
- `eslint-plugin-simple-import-sort`
- `eslint-plugin-sonarjs`
- `eslint-plugin-storybook`
- `eslint-plugin-tailwindcss`
- `eslint-plugin-testing-library`
- `eslint-plugin-toml`
- `eslint-plugin-tsdoc`
- `eslint-plugin-unicorn`
- `eslint-plugin-unused-imports`
- `eslint-plugin-yml`
- `eslint-plugin-zod`
- `eslint-plugin-you-dont-need-lodash-underscore`

## Our Stance on Formatting

This ESLint configuration includes stylistic rules that can format your JavaScript and TypeScript code, promoting consistency.

- **ESLint as the Primary Tool:** For JS/TS files, we encourage using ESLint for both linting code quality and enforcing code style. The VSCode settings above are configured to use ESLint as the default formatter for these files.
- **Working with Prettier:** If you use Prettier in your project, this config is designed to be compatible. It disables ESLint rules that would conflict with Prettier's formatting decisions. You can let Prettier handle formatting for files ESLint doesn't cover (like CSS, HTML, etc.), or even use Prettier for JS/TS formatting and then have ESLint apply further fixes. However, for a streamlined experience with JS/TS, letting ESLint handle all aspects (quality and style) is often simpler.

## Lint Staged / Pre-commit Hooks

To ensure code is linted and fixed before committing, we recommend integrating with a pre-commit tool like `lint-staged` and `husky`. Our sister package, `@anolilab/lint-staged-config`, is designed to work seamlessly with this ESLint configuration.

Example `lint-staged` configuration in your `package.json` (or relevant file):

```json
// package.json
{
    "lint-staged": {
        "*.{js,jsx,ts,tsx}": "eslint --fix"
        // Add other linters for other file types if needed
    }
}
```

Ensure `husky` is set up to run `lint-staged` on pre-commit.

## Versioning Policy

This project aims to follow Semantic Versioning.

- **Major versions:** May include breaking changes to ESLint configurations, Node.js version support, or significant plugin changes.
- **Minor versions:** May introduce new non-breaking rules, enable new plugins by default (if non-breaking), or update existing rules with new options.
- **Patch versions:** Typically include bug fixes or minor tweaks to rule configurations.

Changes to rule strictness (e.g., changing a 'warn' to an 'error') might occur in minor versions if they reflect evolving best practices. We recommend reviewing changes when updating.

## Q & A

### Why not standard

The standard specification believes that everyone should not waste time in personalized specifications, but the entire community should unify a specification. This statement makes sense, but it runs against the ESLint's design philosophy.
Don't you remember how ESLint defeated JSHint and became the most popular JS code inspection tool? It's because of the plugin and configuration that ESLint advocates, which meets the individual needs of different technology stacks of different teams.

Therefore, `@anolilab/eslint-config` also inherits the philosophy of ESLint. It will not force you to use our config.

## Supported Node.js Versions

Libraries in this ecosystem make the best effort to track
[Node.js' release schedule](https://nodejs.org/en/about/releases/). Here's [a
post on why we think this is important](https://medium.com/the-node-js-collection/maintainers-should-consider-following-node-js-release-schedule-ab08ed4de71a).

## Contributing

If you would like to help take a look at the [list of issues](https://github.com/anolilab/javascript-style-guide/issues) and check our [Contributing](.github/CONTRIBUTING.md) guild.

> **Note:** please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Credits

- [Daniel Bannert](https://github.com/prisis)
- [All Contributors](https://github.com/anolilab/javascript-style-guide/graphs/contributors)
- Inspired by and thankful for the work in configurations like:
    - [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
    - [eslint-config-canonical](https://github.com/gajus/eslint-config-canonical)
    - [@antfu/eslint-config](https://github.com/antfu/eslint-config) (for its modern approach and clear documentation)

## License

The anolilab javascript-style-guide is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT)

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[license-image]: https://img.shields.io/npm/l/@anolilab/eslint-config?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
[npm-image]: https://img.shields.io/npm/v/@anolilab/eslint-config/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@anolilab/eslint-config/v/latest "npm"
