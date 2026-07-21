<!-- START_PACKAGE_OG_IMAGE_PLACEHOLDER -->

<a href="https://github.com/anolilab/semantic-release" align="center">

  <img src="__assets__/package-og.svg" alt="oxlint-config" />

</a>

<h3 align="center">oxlint shareable config for Anolilab.</h3>

<!-- END_PACKAGE_OG_IMAGE_PLACEHOLDER -->

<br />

<div align="center">

[![typescript-image][typescript-badge]][typescript-url]
[![mit licence][license-badge]][license]

</div>

---

A shareable [oxlint](https://oxc.rs/docs/guide/usage/linter) configuration for Anolilab. It
enables the `correctness`, `suspicious` and `pedantic` rule categories across a broad plugin set
and leaves the `style` category to [`@anolilab/oxfmt-config`](https://anolilab.com/nodejs/packages/oxfmt-config).

## Install

```sh
npm install --save-dev @anolilab/oxlint-config oxlint
```

```sh
pnpm add -D @anolilab/oxlint-config oxlint
```

> `oxlint` is a peer dependency, install it alongside this package.

## Setup

Run the installer to scaffold a `.oxlintrc.json` for you:

```sh
npx oxlint-config:install
```

Or wire it up manually — there are two ways to consume it.

**`.oxlintrc.json` (extends by path)**

oxlint's JSON config cannot import npm packages, so `extends` points at the file inside `node_modules`:

```json
{
    "$schema": "./node_modules/oxlint/configuration_schema.json",
    "extends": ["./node_modules/@anolilab/oxlint-config/.oxlintrc.json"],
    "rules": {}
}
```

**`oxlint.config.ts` (import the object)**

```ts
import config from "@anolilab/oxlint-config";

export default config;
```

## Overriding

Relax or tighten individual rules on top of the shared base:

```json
{
    "extends": ["./node_modules/@anolilab/oxlint-config/.oxlintrc.json"],
    "rules": {
        "no-console": "off"
    }
}
```

## What it sets

- `categories`: `correctness: "error"`, `suspicious: "warn"`, `pedantic: "warn"`
- `plugins`: `typescript`, `unicorn`, `oxc`, `import`, `promise`, `node`, `jsdoc`, `react`, `jsx-a11y`

The `style` category is intentionally left off — formatting is the formatter's job. Pair this
with [`@anolilab/oxfmt-config`](https://anolilab.com/nodejs/packages/oxfmt-config).

## Related

- [`@anolilab/oxfmt-config`](https://anolilab.com/nodejs/packages/oxfmt-config)
- [`@anolilab/eslint-config`](https://anolilab.com/nodejs/packages/eslint-config)

[typescript-badge]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat-square
[typescript-url]: https://www.typescriptlang.org/ "TypeScript"
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license]: LICENSE.md
