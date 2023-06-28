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
npm install --dev-save @anolilab/prettier-config
```

```sh
yarn add -D @anolilab/prettier-config
```

```sh
pnpm add -D @anolilab/prettier-config
```

## Usage

If you don’t have a `.prettierrc.js` and `.prettierignore`, we will create the file for you after installing `@anolilab/prettier-config`.

> Note: If the script detects an existing `.prettierrc.js` file, it will not overwrite it.

> Note: It can happen that the postinstall script don't run, then you have to add the `.prettierrc.js` manually.

<details>
<summary>File content of the `.prettierrc.js`</summary>

```js
{
    // max 160 characters per line
    printWidth: 160,
    // use 4 spaces for indentation
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
    // all comma at the end
    trailingComma: "all",
    // spaces are required at the beginning and end of the braces
    bracketSpacing: true,
    // brackets are required for arrow function parameter, even when there is only one parameter
    arrowParens: "always",
    // format the entire contents of the file
    rangeStart: 0,
    rangeEnd: Number.POSITIVE_INFINITY,
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
}
```
</details>


## Supported Node.js Versions

Libraries in this ecosystem make the best effort to track
[Node.js’ release schedule](https://nodejs.org/en/about/releases/). Here’s [a
post on why we think this is important](https://medium.com/the-node-js-collection/maintainers-should-consider-following-node-js-release-schedule-ab08ed4de71a).

Contributing
------------

If you would like to help take a look at the [list of issues](https://github.com/anolilab/javascript-style-guide/issues) and check our [Contributing](.github/CONTRIBUTING.md) guild.

> **Note:** please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Credits
-------------

- [Daniel Bannert](https://github.com/prisis)
- [All Contributors](https://github.com/anolilab/javascript-style-guide/graphs/contributors)

License
-------------

The anolilab javascript-style-guide is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT)

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[license-image]: https://img.shields.io/npm/l/@anolilab/prettier-config?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
[npm-image]: https://img.shields.io/npm/v/@anolilab/prettier-config/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@anolilab/prettier-config/v/latest "npm"
