# Stylelint Config

> Stylelint config enforcing an understandable and consistent code style.

## Install

```bash
npm install --dev-save stylelint @anolilab/stylelint-config
```

## Usage

If you don't have a `.stylelintrc.js`, we will create the file for you after installing `@anolilab/stylelint-config`.

If you already have a `.stylelintrc.js`, then you can extend the `.stylelintrc.js`, with `@anolilab/stylelint-config`.

```js
module.exports = {
    "extends": [
        "@anolilab/stylelint-config",
    ]
};
```
