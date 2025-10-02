<div align="center">

<h1>Prettier shareable configuration</h1>

Package that contains shareable configuration for [prettier](https://github.com/prettier/prettier) — a popular opinionated code formatter.

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

## Install

```bash
npm install --dev-save prettier @anolilab/prettier-config
```

```sh
yarn add -D prettier @anolilab/prettier-config
```

```sh
pnpm add -D prettier @anolilab/prettier-config
```

## Usage

If you don’t have a `.prettierrc.js` or the other supported file names and `.prettierignore`, we can create the file for you after installing `@anolilab/prettier-config`, call `pnpm prettier-config:install`.

> Note: If the script detects an existing `.prettierrc.js` file, it will not overwrite it.

<details>
<summary>File content of the `.prettierrc.js`</summary>

```js
module.exports = {
    // brackets are required for arrow function parameter, even when there is only one parameter
    arrowParens: "always",
    // spaces are required at the beginning and end of the braces
    bracketSpacing: true,
    // formats quoted code embedded
    embeddedLanguageFormatting: "auto",
    // lf for newline
    endOfLine: "lf",
    // decide whether to break the html according to the display style
    htmlWhitespaceSensitivity: "css",
    // No need to automatically insert @prettier at the beginning of the file
    insertPragma: false,
    // use double quotes instead of single quotes in jsx
    jsxSingleQuote: false,
    // max 160 characters per line
    printWidth: 160,
    // use default break criteria
    proseWrap: "preserve",
    // object's key is quoted only when necessary
    quoteProps: "as-needed",
    rangeEnd: Number.POSITIVE_INFINITY,
    // format the entire contents of the file
    rangeStart: 0,
    // no need to write the beginning @prettier of the file
    requirePragma: false,
    // semicolon at the end of the line
    semi: true,
    // use single quotes
    singleQuote: false,
    // use 4 spaces for indentation
    tabWidth: 4,
    // all comma at the end
    trailingComma: "all",
    // use spaces instead of indentations
    useTabs: false,
    // vue files script and style tags indentation
    vueIndentScriptAndStyle: false,
};
```

</details>

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

## License

The anolilab javascript-style-guide is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT)

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[license-image]: https://img.shields.io/npm/l/@anolilab/prettier-config?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
[npm-image]: https://img.shields.io/npm/v/@anolilab/prettier-config/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@anolilab/prettier-config/v/latest "npm"
