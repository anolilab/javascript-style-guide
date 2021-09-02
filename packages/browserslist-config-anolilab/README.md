# Browserslist Config

This configuration reflects Growcss’s supported browser policy for their UI library and build tools.

---

<div align="center">
    <p>
        <sup>
            Daniel Bannert's open source work is supported by the community on <a href="https://github.com/sponsors/prisis">GitHub Sponsors</a>
        </sup>
    </p>
</div>

---

## What is Browserslist?

[Browserslist](https://github.com/browserslist/browserslist) is a library to share a browsers list between different front end tools, like Autoprefixer, Eslint, and Stylelint.

-   Valid Browserslist query syntax validation [browserl.ist](http://browserl.ist)
-   ["Browserslist is a Good Idea"](https://css-tricks.com/browserlist-good-idea/) (blog post by [@chriscoyier](https://github.com/chriscoyier))

## Supported Browsers

```js
{
    "production": [
        "> 1%",
        "last 2 versions",
        "Firefox ESR"
    ],
    "legacyBrowsers": [
        "> 1%",
        "last 2 versions",
        "Firefox ESR"
    ],
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
    "ssr": [
        "node 12"
    ]
}
```

## Installation

Install the module

```shell
$ npm install browserslist-config-anolilab --save-dev
```

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
{
    presets: [
        [
            'env',
            {
                targets: {
                    browsers: require('browserslist-config-anolilab'),
                },
            },
        ],
    ];
}
```

## Supported Node.js Versions

Libraries in this ecosystem make the best effort to track
[Node.js' release schedule](https://nodejs.org/en/about/releases/). Here's [a
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
