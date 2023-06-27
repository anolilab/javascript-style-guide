<div align="center">

<h1>Shareable Lint-Staged Config</h1>

Package that contains shareable configuration for [lint-staged](https://github.com/okonet/lint-staged) — a popular tool for running linters on staged Git files.

And optionally for [husky](https://github.com/typicode/husky) — a popular choice for configuring git hooks.

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

Simplify your project setup with our comprehensive collection of preconfigured configuration files.
Designed for effortless integration, these ready-to-use files can be seamlessly imported into your projects.
These functions streamline the utilization of [lint-staged](https://github.com/okonet/lint-staged) alongside popular tools such as [ESLint](https://eslint.org), [Prettier](https://prettier.io), [StyleLint](https://stylelint.io) and [SecretLint](https://github.com/secretlint/secretlint).

Say goodbye to complex configurations and enjoy a smoother development experience with our all-inclusive package.

## Purpose

- Enhance your development workflow with hassle-free and readily shareable lint-staged configuration files.
- These files empower developers to maintain a uniform coding style and detect prevalent errors even before they are added to the source control system.
- Additionally, our inclusive helper module offers convenient utility functions that seamlessly integrate lint-staged with popular linting and formatting tools.

## Install

```bash
npm install --dev-save @anolilab/lint-staged-config lint-staged husky
```

```sh
yarn add -D eslint @anolilab/lint-staged-config lint-staged husky
```

```sh
pnpm add -D eslint @anolilab/lint-staged-config lint-staged husky
```

## Usage

If you don’t have a `.lintstagedrc.js`, we will create the file for you after installing `@anolilab/lint-staged-config`.

If you already have a `.lintstagedrc.js`, then you can extend the `.lintstagedrc.js`, with `@anolilab/lint-staged-config`.

> Note: If the script detects an existing `.lintstagedrc.js` file, it will not overwrite it.

> Note: It can happen that the postinstall script dont run, then you have to add the `.lintstagedrc.js` manually.

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
[license-image]: https://img.shields.io/npm/l/@anolilab/lint-staged-config?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
[npm-image]: https://img.shields.io/npm/v/@anolilab/lint-staged-config/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@anolilab/lint-staged-config/v/latest "npm"
