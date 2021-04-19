# Stylelint Config

> Stylelint config enforcing an understandable and consistent code style.

## Install

```bash
npm install --dev-save browserslist stylelint @anolilab/stylelint-config
```

## Usage

If you don't have a `.stylelintrc.js`, we will create the file for you after installing `@anolilab/stylelint-config`.

If you already have a `.stylelintrc.js`, then you can extend the `.stylelintrc.js`, with `@anolilab/stylelint-config`.

```js
export default {
    "extends": [
        "@anolilab/stylelint-config",
    ]
};
```

Add this command to your `package.json` scripts section

```json
"scripts": {
    "lint:css": "stylelint '**/*.{js,jsx,tsx,ts,less,css,scss,sass}'",
    "lint:css:fix": "stylelint '**/*.{js,jsx,tsx,ts,less,css,scss,sass}' --fix",
```

> Note: this package use `browserslist` to detect the correct browserslist config.
