<div align="center">
<h1>Shareable Browserslist Config</h1>

[![npm-image]][npm-url] [![license-image]][license-url]


It helps you maintain consistency across different projects and ensures that your projects support the same set of browsers.
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

Our package aims to simplify and streamline the configuration process for your projects, ensuring efficiency and minimizing errors. By implementing the following strategies, we achieve this goal:

- Centralized Browser Targeting: Say goodbye to the hassle of defining target browsers for each individual project. Our package eliminates this need, providing a single, consistent configuration.

- Widely Used Target Browsers: We offer a carefully curated selection of popular target browsers. You can rely on our pre-defined set to cover a wide range of user preferences.

- Effortless Updates: Keeping up with evolving browser requirements is effortless with our package. You can easily update the target browsers across all your projects whenever necessary, saving valuable time and effort.

In summary, our Browserslist Config ensures a superior user experience across various browsers, making it a vital tool for maintaining high-quality standards. Your users will enjoy a seamless browsing experience, regardless of their chosen platform.

## Installation

Install the package using your preferred package manager:

```shell
npm install browserslist-config-anolilab --save-dev
```

```sh
pnpm add -D browserslist-config-anolilab
```

```sh
yarn add -D browserslist-config-anolilab
```

Optionally, you can install `browserslist` to use the `browserslist` CLI.

Adding the following script to your root package.json file makes it easier to run the browserslist command in your mono-repository:

```bash
pnpm pkg set scripts.lint:browsers="browserslist"
```

For `npm` users, replace `pnpm` with `npm` in the above command.

This script allows you to run the `browserslist` command by simply typing `pnpm run lint:browsers` (or `npm run lint:browsers` for npm users) in the terminal.

## Usage

### Package.json

```json
{
    "browserslist": ["extends browserslist-config-anolilab"]
}
```

Alternatively, add this to `.browserslistrc` file:

```
extends browserslist-config-anolilab
```

Or when using [babel-preset-env](https://github.com/babel/babel/tree/master/experimental/babel-preset-env)

```js
module.exports = {
    presets: [
        [
            'env',
            {
                targets: {
                    // eslint-disable-next-line global-require
                    browsers: require('browserslist-config-anolilab'),
                },
            },
        ],
    ],
}
```

## What is Browserslist?

[Browserslist](https://github.com/browserslist/browserslist) is a library to share a browsers list between different front end tools, like Autoprefixer, Eslint, and Stylelint.

-   Valid Browserslist query syntax validation [browserl.ist](http://browserl.ist)
-   ["Browserslist is a Good Idea"](https://css-tricks.com/browserlist-good-idea/) (blog post by [@chriscoyier](https://github.com/chriscoyier))

## Supported Browsers

```json
{
    "legacyBrowsers": ["> 1%", "last 2 versions", "Firefox ESR"],
    "modernBrowsers": [
        "last 2 Chrome versions",
        "not Chrome < 60",
        "last 2 Safari versions",
        "not Safari < 10.1",
        "last 2 iOS versions",
        "not iOS < 10.3",
        "last 2 Firefox versions",
        "not Firefox < 54",
        "last 2 Edge versions",
        "not Edge < 15"
    ],
    "node": ["last 2 node major versions"],
    "production": ["> 1%", "last 2 versions", "Firefox ESR", "not dead"],
    "ssr": ["node 22"]
}
```

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

[license-image]: https://img.shields.io/npm/l/browserslist-config-anolilab?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
[npm-image]: https://img.shields.io/npm/v/browserslist-config-anolilab/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/browserslist-config-anolilab/v/latest "npm"
