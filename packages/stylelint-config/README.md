<div align="center">

<h1>Shareable Stylelint Config</h1>

This npm package provides a set of shareable configurations for Stylelint 15+ — a linter for CSS.

[![npm-image]][npm-url] [![license-image]][license-url]

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

## Propose

Our package offers a comprehensive collection of opinionated, yet adaptable configurations for [stylelint](https://stylelint.io/).
These configurations are designed to empower developers in achieving consistent code styling and mitigating common errors. Here's what our package brings to the table:

- A Strong Foundation for Code Styling: We provide a robust starting point for your project's code styling. Our configurations serve as a solid foundation that can be effortlessly extended and modified according to your specific needs. With this flexibility, you can easily tailor the styling rules to align with your project's requirements.

- Enforcing Best Practices: Our package ensures adherence to widely accepted best practices for CSS development. By enforcing consistent indentation, discouraging the use of vendor prefixes, and discouraging unnecessary specificity, we promote cleaner and more maintainable code. These practices help streamline collaboration and enhance the readability of your stylesheets.

- Error Prevention: Our configurations are equipped to catch common errors that can often go unnoticed. We help you identify and rectify issues like missing units for numeric values, usage of invalid colors, and utilization of unsupported or deprecated CSS features. By proactively highlighting these errors, we aid in improving the overall quality and compatibility of your stylesheets.

- Consistency Across Codebase: Maintaining consistency throughout your codebase is essential for a polished end result. Our package plays a pivotal role in achieving this objective. By providing clear and consistent rules for code styling, we empower developers to adhere to a unified approach. This not only enhances readability but also simplifies maintenance and collaboration within your team.

In summary, our package equips developers with opinionated yet flexible stylelint configurations. By ensuring consistent code styling and error prevention, we streamline the development process and foster a more efficient and harmonious coding environment.

## Install

```bash
npm install --dev-save browserslist stylelint @anolilab/stylelint-config
```

```sh
pnpm add -D browserslist stylelint @anolilab/stylelint-config
```

```sh
yarn add -D browserslist stylelint @anolilab/stylelint-config
```

## Usage

If you don’t have a `.stylelintrc.js`, we will create the file for you after installing `@anolilab/stylelint-config`.

If you already have a `.stylelintrc.js`, then you can extend the `.stylelintrc.js`, with `@anolilab/stylelint-config`.

```js
module.exports = {
    extends: [
        "@anolilab/stylelint-config",
    ]
};
```

You can also customize the rules provided in the configurations or create your own configuration that extends one of the provided configurations.
For more information on how to configure stylelint, see the [stylelint configuration documentation](https://stylelint.io/user-guide/configure).

## Tailwind Support

For tailwind you need to extend the stylelint rules

```js
module.exports = {
    extends: [
        "@anolilab/stylelint-config",
    ],
    rules: {
        // Only for Tailwind support
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: ["tailwind", "apply", "variants", "responsive", "screen", "@tailwind"],
            },
        ],
        "declaration-block-trailing-semicolon": null,
        "no-descending-specificity": null,
    },
};
```

Add a Package.json Script

To add an NPM script for running `stylelint` use command, which will add the `lint:css` and `lint:css:fix` script to the scripts section of your `package.json`.

```sh
pnpm pkg set scripts.lint:css="stylelint --config=./.stylelintrc.js '**/*.{js,jsx,tsx,ts,less,css,scss,sass}'"
pnpm pkg set scripts.lint:css:fix="pnpm run lint:css --fix"
```

> For `npm` users, replace `pnpm` with npm in the above command.

or copy the following to your `package.json`:

```json
  {
    "scripts": {
      "lint:css": "stylelint --config=./.stylelintrc.js '**/*.{js,jsx,tsx,ts,less,css,scss,sass}'",
      "lint:css:fix": "stylelint --config=./.stylelintrc.js '**/*.{js,jsx,tsx,ts,less,css,scss,sass}' --fix"
    }
  }
```

This will run `stylelint` on all defined files in your app's directory and its subdirectories.
You can customize the files and directories to be linted as needed.

> Note: this package use `browserslist` to detect the correct browserslist config.

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

[license-image]: https://img.shields.io/npm/l/@anolilab/stylelint-config?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
[npm-image]: https://img.shields.io/npm/v/@anolilab/stylelint-config/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@anolilab/stylelint-config/v/latest "npm"
