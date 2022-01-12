# Babel preset

A babel preset for transforming your JavaScript for Anolilab.

---

<div align="center">
    <p>
        <sup>
            Daniel Bannert's open source work is supported by the community on <a href="https://github.com/sponsors/prisis">GitHub Sponsors</a>
        </sup>
    </p>
</div>

---

It contains transforms for all stage 4 (ES2018) and stage 3 syntax.
<!-- textlint-disable -->

Additionally, stage 4 syntax that is excluded is as follows:

-   Generators: regenerator-runtime is too heavyweight for our use.
-   Lifted template literal restrictions: we do not use tagged template literals, nor implement custom DSLs, otherwise we would enable this.

<!-- textlint-enable -->

[fast-async](https://github.com/MatAtBread/fast-async) is used to compile async function without generators.

## Install

```sh
$ npm install --save-dev @babel/core @babel/runtime @anolilab/babel-preset
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
    "presets": ["@anolilab/babel-preset"]
}
```

### Via CLI

```sh
$ babel script.js --presets @anolilab/babel-preset
```

### Via Node API

```javascript
require("@babel/core").transform("code", {
    presets: ["@anolilab/babel-preset"],
});
```

### Targeting Environments

This module uses `@babel/preset-env` to target specific environments.

Please refer to [@babel/preset-env#targets](https://babeljs.io/docs/en/babel-preset-env#targets) for a list of available options.

For a list of browsers please see [browserlist](https://github.com/browserslist/browserslist).

You may override our default list of targets by providing your own `targets` key.

[List of our supported browsers](https://browserl.ist/?q=last+1+Android+versions%2C+last+1+ChromeAndroid+versions%2C+last+2+Chrome+versions%2C+last+2+Firefox+versions%2C+last+2+Safari+versions%2C+last+2+iOS+versions%2C+last+2+Edge+versions%2C+last+2+Opera+versions%2C+%3E+1%25%2C+ie+%3E%3D+11)

The following transpiles only for Node v6.

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "targets": {
                    "node": 6
                }
            }
        ]
    ]
}
```

If you wish, you can also inherit our default list of browsers and extend them.

```javascript
const browserlist = require("browserslist-config-anolilab");

module.exports = {
    presets: [
        [
            "@anolilab/babel-preset",
            {
                targets: browserlist['production'],
            },
        ],
    ],
};
```

You may override our default debug option by providing your own `debug` key.

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "debug": true
            }
        ]
    ]
}
```

## Typescript Mode

To use this preset please install

```sh
$ npm install --save-dev @babel/preset-typescript @babel/plugin-syntax-jsx
```

This preset can be configured to support `typescript`, using `"typescript": true` in our preset.

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "typescript": true
            }
        ]
    ]
}
```

## React Mode

To use this preset please install

```sh
$ npm install --save-dev @babel/preset-react
```

This preset can be configured to support `react`, using `"react": true` or `"react": {...}` in our preset.

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "react": true
            }
        ]
    ]
}
```

Or

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "react": {
                    "pragma": "dom", // default pragma is React.createElement (only in classic runtime)
                    "pragmaFrag": "DomFrag", // default is React.Fragment (only in classic runtime)
                    "throwIfNamespace": false, // defaults to true
                    "runtime": "classic" // defaults to classic
                    // "importSource": "custom-jsx-library" // defaults to react (only in automatic runtime)
                }
            }
        ]
    ]
}
```

## React Development Mode

When `process.env.NODE_ENV` is `'development'`, [the `development` mode will be set for `@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react#development).

You may override our default development option by providing your own boolean `development` key.

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "react": true,
                "development": false
            }
        ]
    ]
}
```

## React PropTypes removal

This preset can be configured to remove propTypes using [babel-plugin-transform-react-remove-prop-types](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types) with the following default options:

To enable this transformation with the default options, set the `removePropTypes` option to `true`:

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "react": true,
                "removePropTypes": true
            }
        ]
    ]
}
```

The default options that will be used are:

```json
{
    "mode": "wrap",
    "ignoreFilenames": ["node_modules"]
}
```

Default options can be overridden using the `removePropTypes` option. These options will be shallow-merged with the defaults:

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "removePropTypes": {
                    "mode": "remove"
                }
            }
        ]
    ]
}
```

For example, if you are using this plugin in a deployable app, you want to use the remove mode for your production build (and disable this transform entirely in development for optimal build speeds).

## Selective loose modes

By default, this preset will compile everything in lose mode. We have options to selectively opt out to loose mode for features. These options are:

- [env](https://babeljs.io/docs/en/babel-preset-env#loose) `loose`
- [classes](https://babeljs.io/docs/en/babel-plugin-transform-classes#loose): `looseClasses`
- [computed properties](https://babeljs.io/docs/en/babel-plugin-transform-computed-properties#loose): `looseComputedProperties`
- [parameters](https://babeljs.io/docs/en/babel-plugin-transform-parameters#loose): `looseParameters`
- [template literals](https://babeljs.io/docs/en/babel-plugin-transform-template-literals#loose): `looseTemplateLiterals`
- [object rest spread](https://babeljs.io/docs/en/babel-plugin-proposal-object-rest-spread#loose): `looseObjectRestSpread`

Example:

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "loose": false,
                "looseClasses": false,
                "looseComputedProperties": false,
                "looseParameters": false,
                "looseTemplateLiterals": false,
                "looseObjectRestSpread": false
            }
        ]
    ]
}
```

The [risks of enabling loose classes are outlined in the Babel docs](https://babeljs.io/docs/en/babel-plugin-transform-classes#loose).

## Specifying module transforms

You can use the `modules` option to enable transformation of modules given to this preset:

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "modules": "auto"
            }
        ]
    ]
}
```

Both `true` and the option default `auto` will not transform modules if ES6 module syntax is already supported by the environment, or `"commonjs"` otherwise. `false` will not transform modules.

## Specifying use of core-js v3

You can use the `corejs` option to enable the use of the core-js v3 polyfills:

```json
{
    "presets": [
        [
            "@anolilab/babel-preset",
            {
                "corejs": {
                    "version": 3
                }
            }
        ]
    ]
}
```

## Optimizations

- [`babel-plugin-annotate-pure-calls`](https://github.com/Andarist/babel-plugin-annotate-pure-calls): Injects for `#__PURE` annotations to enable tree-shaking
- [`babel-plugin-dev-expressions`](https://github.com/4Catalyzer/babel-plugin-dev-expression): A mirror of Facebook’s dev-expression Babel plugin. It reduces or eliminates development checks from production code

### Development-only Expressions + Treeshaking

`babel-plugin-annotate-pure-calls` + `babel-plugin-dev-expressions` work together to fully eliminate dead code (aka treeshake) development checks from your production code. Let’s look at an example to see how it works.


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
