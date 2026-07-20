<!-- START_PACKAGE_OG_IMAGE_PLACEHOLDER -->

<a href="https://github.com/anolilab/semantic-release" align="center">

  <img src="__assets__/package-og.svg" alt="oxfmt-config" />

</a>

<h3 align="center">oxfmt (Oxc formatter) shareable config for Anolilab.</h3>

<!-- END_PACKAGE_OG_IMAGE_PLACEHOLDER -->

<br />

<div align="center">

[![typescript-image][typescript-badge]][typescript-url]
[![mit licence][license-badge]][license]

</div>

---

A shareable [oxfmt](https://oxc.rs/docs/guide/usage/formatter) configuration that mirrors
[`@anolilab/prettier-config`](https://anolilab.com/nodejs/packages/prettier-config) wherever
oxfmt supports the same option, so code formatted by oxfmt matches code formatted by Prettier
under the Anolilab style.

## Install

```sh
npm install --save-dev @anolilab/oxfmt-config oxfmt
```

```sh
pnpm add -D @anolilab/oxfmt-config oxfmt
```

> `oxfmt` is a peer dependency, install it alongside this package.

## Setup

Run the installer to scaffold an `oxfmt.config.js` for you:

```sh
npx oxfmt-config:install
```

Or wire it up manually.

**`oxfmt.config.js`**

```js
import config from "@anolilab/oxfmt-config";

export default {
    ...config,
};
```

**`oxfmt.config.ts`**

```ts
import config from "@anolilab/oxfmt-config";

export default config;
```

## Overriding

Spread the config and change what you need:

```js
import config from "@anolilab/oxfmt-config";

export default {
    ...config,
    printWidth: 120,
};
```

## What it sets

The config sets the subset of oxfmt options that overlap with the Anolilab Prettier style —
`printWidth: 160`, `tabWidth: 4`, double quotes, semicolons, `trailingComma: "all"`,
`arrowParens: "always"` — and leaves oxfmt's own defaults for everything else.

## Related

- [`@anolilab/oxlint-config`](https://anolilab.com/nodejs/packages/oxlint-config)
- [`@anolilab/prettier-config`](https://anolilab.com/nodejs/packages/prettier-config)
- [`@anolilab/eslint-config`](https://anolilab.com/nodejs/packages/eslint-config)

[typescript-badge]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat-square
[typescript-url]: https://www.typescriptlang.org/ "TypeScript"
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license]: LICENSE.md
