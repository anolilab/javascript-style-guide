# Stylelint Config

> Stylelint config enforcing an understandable and consistent code style.

## Install

```bash
npm install --dev-save browserslist stylelint @anolilab/stylelint-config
```

## Usage

If you don't have a `.stylelintrc.cjs`, we will create the file for you after installing `@anolilab/stylelint-config`.

If you already have a `.stylelintrc.cjs`, then you can extend the `.stylelintrc.cjs`, with `@anolilab/stylelint-config`.

```js
module.exports = {
    extends: [
        "@anolilab/stylelint-config",
    ]
};
```

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

Add this command to your `package.json` scripts section

```json
  {
    "scripts": {
      "lint:css": "stylelint --config=./.stylelintrc.cjs '**/*.{js,jsx,tsx,ts,less,css,scss,sass}'",
      "lint:css:fix": "stylelint --config=./.stylelintrc.cjs '**/*.{js,jsx,tsx,ts,less,css,scss,sass}' --fix"
    }
  }
```

> Note: this package use `browserslist` to detect the correct browserslist config.
