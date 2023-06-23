# Javascript Style Guide

This project is a shareable code style guide of all basic back- and front end project used at Anolilab.

---

<div align="center">
    <p>
        <sup>
            Daniel Bannert's open source work is supported by the community on <a href="https://github.com/sponsors/prisis">GitHub Sponsors</a>
        </sup>
    </p>
</div>

---

This is a mono-repository that contains a collection of separate, shareable npm packages that provide various configuration files for commonly used tools in modern web development.

## Usage

Check the README for each configuration within the `packages` directory for specific usage instructions.


## Featured Packages

| Tool                                                                     | Package                                                                                                                             | Version                                                                                                                         | Description                                                                                                |
|--------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [babel](https://github.com/babel/babel)                                  | [babel-preset](https://github.com/anolilab/javascript-style-guide/blob/main/packages/babel-preset/README.md)                        | ![npm](https://img.shields.io/npm/v/@anolilab/babel-preset?style=flat-square&labelColor=292a44&color=663399&label=v)            | Babel is a JavaScript compiler to use next generation JavaScript, today                                    |
| [browserslist](https://github.com/browserslist/browserslist)             | [browserslist-config](https://github.com/anolilab/javascript-style-guide/blob/main/packages/browserslist-config-anolilab/README.md) | ![npm](https://img.shields.io/npm/v/browserslist-config-anolilab?style=flat-square&labelColor=292a44&color=663399&label=v)      | Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env |
| [commitlint](https://commitlint.js.org/#/)                               | [commitlint-config](https://github.com/anolilab/javascript-style-guide/blob/main/packages/commitlint-config/README.md)              | ![npm](https://img.shields.io/npm/v/@anolilab/commitlint-config?style=flat-square&labelColor=292a44&color=663399&label=v)       | Helps your team adhere to a commit convention.                                                             |
| [eslint](https://eslint.org)                                             | [eslint-config](https://github.com/anolilab/javascript-style-guide/blob/main/packages/eslint-config/README.md)                      | ![npm](https://img.shields.io/npm/v/@anolilab/eslint-config?style=flat-square&labelColor=292a44&color=663399&label=v)           | Statically analyzes your code to quickly find problems.                                                    |
| -                                                                        | [package-json-utils](https://github.com/anolilab/javascript-style-guide/blob/main/packages/package-json-utils/README.md)            | ![npm](https://img.shields.io/npm/v/@anolilab/package-json-utils?style=flat-square&labelColor=292a44&color=663399&label=v)      | Shared utilities for parsing information from a package.json file.                                         |
| [lint-staged](https://github.com/okonet/lint-staged)                     | [lint-staged-config](https://github.com/anolilab/javascript-style-guide/blob/main/packages/lint-staged-config/README.md)            | ![npm](https://img.shields.io/npm/v/@anolilab/lint-staged-config?style=flat-square&labelColor=292a44&color=663399&label=v)      | Run linters on git staged files.                                                                           |
| [postcss](https://postcss.org)                                           | [postcss-config](https://github.com/anolilab/javascript-style-guide/blob/main/packages/postcss-config/README.md)                    | ![npm](https://img.shields.io/npm/v/@anolilab/postcss-config?style=flat-square&labelColor=292a44&color=663399&label=v)          | Add vendor prefixes to CSS rules using values from [Can I Use](https://caniuse.com).                       |
| [prettier](https://github.com/prettier/prettier)                         | [prettier-config](https://github.com/anolilab/javascript-style-guide/blob/main/packages/prettier-config/README.md)                  | ![npm](https://img.shields.io/npm/v/@anolilab/prettier-config?style=flat-square&labelColor=292a44&color=663399&label=v)         | Prettier is an opinionated code formatter.                                                                 |
| [semantic-release](https://github.com/semantic-release/semantic-release) | [semantic-release-preset](https://github.com/anolilab/javascript-style-guide/blob/main/packages/semantic-release-preset/README.md)  | ![npm](https://img.shields.io/npm/v/@anolilab/semantic-release-preset?style=flat-square&labelColor=292a44&color=663399&label=v) | semantic-release is a fully automated version management and package publishing library                    |
| [secretlint](https://github.com/secretlint/secretlint)                   | [secretlint-config](https://github.com/anolilab/javascript-style-guide/blob/main/packages/secretlint-config/README.md)              | ![npm](https://img.shields.io/npm/v/@anolilab/secretlint-config?style=flat-square&labelColor=292a44&color=663399&label=v)       | Pluggable linting tool to prevent committing credential                                                    |
| [stylelint](https://stylelint.io)                                        | [stylelint-config](https://github.com/anolilab/javascript-style-guide/blob/main/packages/stylelint-config/README.md)                | ![npm](https://img.shields.io/npm/v/@anolilab/stylelint-config?style=flat-square&labelColor=292a44&color=663399&label=v)        | Linter that helps you avoid errors and enforce conventions in your styles                                  |
| [textlint](https://github.com/textlint/textlint)                         | [textlint-config](https://github.com/anolilab/javascript-style-guide/blob/main/packages/textlint-config/README.md)                  | ![npm](https://img.shields.io/npm/v/@anolilab/textlint-config?style=flat-square&labelColor=292a44&color=663399&label=v)         | The pluggable natural language linter for text and markdown.                                               |

## Badge

Show the world that you are using Anolilab’s code style in your project by including the badge in your readme.

[![Anolilab’s Code Style](https://img.shields.io/badge/code_style-Anolilab%E2%80%99s-663399.svg?labelColor=292a44&style=flat-square)][repository]

```md
[![Anolilab’s Code Style](https://img.shields.io/badge/code_style-Anolilab%E2%80%99s-663399.svg?labelColor=292a44&style=flat-square)](https://github.com/anolilab/javascript-style-guide)
```

## How We Version

We use [SemVer](https://semver.org/) for its versioning providing us an opt-in approach to releases.
This means we add a version number according to the spec, as you see below.
So rather than force developers to consume the latest and greatest, they can choose which version to consume and test any newer ones before upgrading.
Please the read the spec as it goes into further detail.

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

[repository]: https://github.com/anolilab/javascript-style-guide
