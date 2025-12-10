<!-- START_PACKAGE_OG_IMAGE_PLACEHOLDER -->

<a href="https://github.com/anolilab/semantic-release" align="center">

  <img src="__assets__/package-og.svg" alt="prettier-config" />

</a>

<h3 align="center">Prettier shareable config for Anolilab.</h3>

<!-- END_PACKAGE_OG_IMAGE_PLACEHOLDER -->

<br />

<div align="center">

[![typescript-image][typescript-badge]][typescript-url]
[![mit licence][license-badge]][license]
[![npm downloads][npm-downloads-badge]][npm-downloads]
[![Chat][chat-badge]][chat]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]

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

```sh
npm install @anolilab/prettier-config
```

```sh
yarn add @anolilab/prettier-config
```

```sh
pnpm add @anolilab/prettier-config
```

## Usage

If you don't have a `.prettierrc.js` or the other supported file names and `.prettierignore`, we can create the file for you after installing `@anolilab/prettier-config`, call `pnpm prettier-config:install`.

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

## Related

## Supported Node.js Versions

Libraries in this ecosystem make the best effort to track [Node.js' release schedule](https://github.com/nodejs/release#release-schedule).

Here's [a post on why we think this is important](https://medium.com/the-node-js-collection/maintainers-should-consider-following-node-js-release-schedule-ab08ed4de71a).

## Contributing

If you would like to help take a look at the [list of issues](https://github.com/anolilab/javascript-style-guide/issues) and check our [Contributing](.github/CONTRIBUTING.md) guidelines.

> **Note:** please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Credits

- [Daniel Bannert](https://github.com/prisis)

- [All Contributors](https://github.com/anolilab/javascript-style-guide/graphs/contributors)

## Made with ❤️ at Anolilab

This is an open source project and will always remain free to use. If you think it's cool, please star it 🌟. [Anolilab](https://www.anolilab.com/open-source) is a Development and AI Studio. Contact us at [hello@anolilab.com](mailto:hello@anolilab.com) if you need any help with these technologies or just want to say hi!

## License

The anolilab prettier-config is open-sourced software licensed under the [MIT][license-url]

<!-- badges -->

[license-badge]: https://img.shields.io/npm/l/@anolilab/prettier-config?style=for-the-badge
[license]: https://github.com/anolilab/javascript-style-guide/blob/main/LICENSE
[npm-downloads-badge]: https://img.shields.io/npm/dm/@anolilab/prettier-config?style=for-the-badge
[npm-downloads]: https://www.npmjs.com/package/@anolilab/prettier-config
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge
[prs-welcome]: https://github.com/anolilab/javascript-style-guide/blob/main/.github/CONTRIBUTING.md
[chat-badge]: https://img.shields.io/discord/902465130518949899.svg?style=for-the-badge
[chat]: https://discord.gg/4VuvwWGaaB
[typescript-badge]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: https://www.typescriptlang.org/
[license-url]: https://opensource.org/licenses/MIT
