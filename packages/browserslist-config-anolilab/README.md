# Browserslist Config

This configuration reflects Growcss's supported browser policy for their UI library and build tools.

## What is Browserslist?

[Browserslist](https://github.com/ai/browserslist) is a library to share a browsers list between different front-end tools, like Autoprefixer, Eslint, and Stylelint.

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

### package.json

```json
{
    "browserslist": ["extends browserslist-config-anolilab"]
}
```

Alternatively, add this to `.browserslistrc` file:

```
extends browserslist-config-anolilab
```

or when using [babel-preset-env](https://github.com/babel/babel/tree/master/experimental/babel-preset-env)

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
