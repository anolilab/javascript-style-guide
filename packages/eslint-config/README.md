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

Our package serves as a valuable resource for JavaScript/Typescript-based projects, offering composable [ESLint](https://eslint.org/) configurations. It encompasses a range of features, including performance optimization and the flexibility to extend pre-defined base configurations.

- Tailored Configuration for Workspaces: With this package, each workspace within your monorepo gains the ability to have its own customized ESLint configuration. This ensures that individual projects can maintain their specific requirements while still adhering to the overall guidelines.

- Configurability at Your Fingertips: Crafting your workspace's ESLint configuration is a breeze, thanks to the seamless composition of pre-defined base configurations. This empowers you to tailor the settings to suit your project's unique needs, without starting from scratch.

- Streamlined Convenience: Say goodbye to the hassle of installing plugins for each workspace. Our package integrates [@rushstack/eslint-patch](https://www.npmjs.com/package/@rushstack/eslint-patch), eliminating the need for repetitive plugin installations. Enjoy peace of mind as you focus on your work, knowing that the necessary plugins are automatically included.

- Enhanced Efficiency: We've optimized the package's performance by intelligently enabling plugins based on file naming conventions. This streamlined approach ensures that your ESLint checks run efficiently, targeting the relevant files and maximizing productivity.

In summary, our package provides comprehensive and adaptable ESLint configurations for JavaScript and Typescript projects. It empowers you to achieve code quality while minimizing overhead and maximizing productivity throughout your workspaces.

## Highlights

- Zero-config, but configurable when needed.
- Enforces readable code, because you read more code than you write.
- No need to specify file paths to lint as it lints all JS/TS files except for commonly ignored paths.
- Config overrides per files/globs.
- TypeScript supported by default, if `typescript` was installed.
- Includes many useful ESLint plugins, like [unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn), [import](https://github.com/benmosher/eslint-plugin-import) and [more](#plugins).
- Automatically enables rules based on the [engines](https://docs.npmjs.com/files/package.json#engines) field in your package.json.
- Specify indent and semicolon preferences easily without messing with the rule config.
- Disables rules that conflict with [Prettier](#let-prettier-handle-style-related-rules).
- Typesafe, because it's written in TypeScript and uses [eslint-define-config](https://github.com/Shinigami92/eslint-define-config) to define the config.

## Install

To install this config, run the following command.

> Note: `eslint-plugin-import@npm:eslint-plugin-i` is needed to use the correct package.

```bash
npm install --save-dev eslint @anolilab/eslint-config eslint-plugin-import@npm:eslint-plugin-i@latest @babel/core @eslint-types/import @eslint-types/deprecation @eslint-types/jsdoc @eslint-types/typescript-eslint @eslint-types/unicorn
```

```sh
pnpm add -D eslint @anolilab/eslint-config eslint-plugin-import@npm:eslint-plugin-i@latest @babel/core @eslint-types/import @eslint-types/deprecation @eslint-types/jsdoc @eslint-types/typescript-eslint @eslint-types/unicorn
```

```sh
yarn add -D eslint @anolilab/eslint-config eslint-plugin-import@npm:eslint-plugin-i@latest @babel/core @eslint-types/import @eslint-types/deprecation @eslint-types/jsdoc @eslint-types/typescript-eslint @eslint-types/unicorn
```

## Usage

> Note: Our default export contains all of our ESLint rules, including ECMAScript 6+. `@anolilab/eslint-config` use the `ecmaVersion`:`2021` as default.
>
> To change this configuration, change `env: { es2021: false, then active you needed env }` same for, `parserOptions: { "ecmaVersion": 2021 change the version }`

## Plugins

### Code Quality

This plugin provide a range of code quality rules:

- [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [eslint-plugin-antfu](https://github.com/antfu/eslint-config)

### Languages

The following plugins expand esLint to work with json files, and lint JavaScript contained in HTML, and MarkDown:

- [eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html)
- [eslint-plugin-jsonc](https://github.com/ota-meshi/eslint-plugin-jsonc)
- [eslint-plugin-markdown](https://github.com/eslint/eslint-plugin-markdown)
- [eslint-plugin-mdx](https://github.com/mdx-js/eslint-mdx)
- [eslint-plugin-toml](https://github.com/ota-meshi/eslint-plugin-toml)
- [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)

When linting code snippets in Markdown files, a few [rules](src/config/plugins/markdown.ts#L3) relating to globals and unused vars are disabled.

### Library Plugins

If a supported library is part of your project then it’s related esLint plugins will be loaded. The following plugins are supported:

- [eslint-plugin-fsa](https://github.com/joseph-galindo/eslint-plugin-fsa)
- [eslint-plugin-lodash](https://github.com/wix/eslint-plugin-lodash)
    - You need to install `eslint-plugin-lodash` and `lodash` to use this plugin.
- [eslint-plugin-lodash-fp](https://github.com/jfmengels/eslint-plugin-lodash-fp)
    - You need to install `eslint-plugin-lodash-fp` and `lodash` to use this plugin.
- [eslint-plugin-react-redux](https://github.com/DianaSuvorova/eslint-plugin-react-redux#readme)
    - You need to install `eslint-plugin-react-redux` and `react-redux` to use this plugin.
- [eslint-plugin-redux-saga](https://github.com/pke/eslint-plugin-redux-saga)
    - You need to install `eslint-plugin-redux-saga` and `redux-saga` to use this plugin.

### Practices

The following esLint plugins enforce good coding practices:

- [eslint-plugin-array-func](https://github.com/freaktechnik/eslint-plugin-array-func)
- [eslint-plugin-eslint-comments](https://github.com/mysticatea/eslint-plugin-eslint-comments)
- [eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise)
- [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)
- [eslint-plugin-es-x](https://github.com/eslint-community/eslint-plugin-es-x)

### Security

These plugins add code security rules to esLint:

- [eslint-plugin-no-secrets](https://github.com/nickdeis/eslint-plugin-no-secrets)
- [eslint-plugin-no-unsanitized](https://github.com/mozilla/eslint-plugin-no-unsanitized)
- [eslint-plugin-sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security)
- [rushstack/eslint-plugin-security](https://www.npmjs.com/package/@rushstack/eslint-plugin-security)

### Test Libraries

The following test plugins are supported:

- [eslint-plugin-ava](https://github.com/avajs/eslint-plugin-ava)
    - You need to install `@vitest/eslint-plugin` and `vitest` to use this plugin.
### List of used plugins

- eslint-plugin-security
- @typescript-eslint/eslint-plugin
- eslint-plugin-antfu
- eslint-plugin-compat
- eslint-plugin-es-x
- eslint-plugin-eslint-comments
- eslint-plugin-html
- eslint-plugin-i
- eslint-plugin-jsonc
- eslint-plugin-markdown
- eslint-plugin-no-only-tests
- eslint-plugin-no-secrets
- eslint-plugin-promise
- eslint-plugin-regexp
- eslint-plugin-simple-import-sort
- eslint-plugin-sonarjs
- eslint-plugin-toml
- eslint-plugin-typescript-sort-keys
- eslint-plugin-unicorn
- eslint-plugin-yml

## Troubleshooting

### With VSCode

ESLint will not lint `.vue`, `.ts` or `.tsx` files in VSCode by default, you need to set your `.vscode/settings.json` like this:

```json
{
    "eslint.validate": ["css", "html", "javascript", "javascriptreact", "json", "markdown", "typescript", "typescriptreact", "yaml"]
}
```

#### Autofix ESLint errors on save

If you want to enable auto-fix-on-save, you need to set your `.vscode/settings.json` like this:

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    "editor.formatOnSave": true
}
```

Additionally, we found it that being explicit about which formatter you are using for each file improves DX:

```json
{
    "[css]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[html]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[javascript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[javascriptreact]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[json]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[markdown]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[typescript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[yaml]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    }
}
```

While not required if you've configured explicit formatter for each file type, I advise that you explicitly disable prettier extension in your project:

```json
{
    "prettier.enable": false
}
```

Sharing these settings in your project should be sufficient to prevent local settings accidentally overriding the desired formatter behavior.

## Q & A

### Why not standard

The standard specification believes that everyone should not waste time in personalized specifications, but the entire community should unify a specification. This statement makes sense, but it runs against the ESLint’s design philosophy.
Don’t you remember how ESLint defeated JSHint and became the most popular JS code inspection tool? It’s because of the plugin and configuration that ESLint advocates, which meets the individual needs of different technology stacks of different teams.

Therefore, `@anolilab/eslint-config` also inherits the philosophy of ESLint. It will not force you to use our config.

## Supported Node.js Versions

Libraries in this ecosystem make the best effort to track
[Node.js’ release schedule](https://nodejs.org/en/about/releases/). Here’s [a
post on why we think this is important](https://medium.com/the-node-js-collection/maintainers-should-consider-following-node-js-release-schedule-ab08ed4de71a).

## Contributing

If you would like to help take a look at the [list of issues](https://github.com/anolilab/javascript-style-guide/issues) and check our [Contributing](.github/CONTRIBUTING.md) guild.

> **Note:** please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Credits

- [Daniel Bannert](https://github.com/prisis)
- [All Contributors](https://github.com/anolilab/javascript-style-guide/graphs/contributors)
- [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
- [eslint-config-canonical](https://github.com/gajus/eslint-config-canonical)

## License

The anolilab javascript-style-guide is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT)

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[license-image]: https://img.shields.io/npm/l/@anolilab/eslint-config?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
[npm-image]: https://img.shields.io/npm/v/@anolilab/eslint-config/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@anolilab/eslint-config/v/latest "npm"
