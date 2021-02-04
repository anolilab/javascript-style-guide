# Browserslist Config

This configuration reflects Growcss's supported browser policy for their UI library and build tools.

## What is Browserslist?

[Browserslist](https://github.com/ai/browserslist) is a library to share a browsers list between different front-end tools, like Autoprefixer, Eslint, and Stylelint.

-   Valid Browserslist query syntax validation [browserl.ist](http://browserl.ist)
-   ["Browserslist is a Good Idea"](https://css-tricks.com/browserlist-good-idea/) (blog post by [@chriscoyier](https://github.com/chriscoyier))

## Supported Browsers

| Browsers list |                        |
| ------------- | ---------------------- |
| 1%            | global browser         |
| ie            | >= 11                  |
| last 1        | Android versions       |
| last 1        | ChromeAndroid versions |
| last 2        | Chrome versions        |
| last 2        | Firefox versions       |
| last 2        | Safari versions        |
| last 2        | iOS versions           |
| last 2        | Edge versions          |
| last 2        | Opera versions         |

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
extends browserslist-config-growcss
```

or when using [babel-preset-env](https://github.com/babel/babel/tree/master/experimental/babel-preset-env)

```js
{
    presets: [
        [
            'env',
            {
                targets: {
                    browsers: require('browserslist-config-growcss'),
                },
            },
        ],
    ];
}
```
