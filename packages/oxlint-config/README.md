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
enables the `correctness` category and lists every other rule it turns on by name, so no rule
switches on by category alone. It leaves the `style` category to [`@anolilab/oxfmt-config`](https://anolilab.com/nodejs/packages/oxfmt-config).

## Install

```sh
npm install --save-dev @anolilab/oxlint-config oxlint oxlint-tsgolint
```

```sh
pnpm add -D @anolilab/oxlint-config oxlint oxlint-tsgolint
```

> `oxlint` and `oxlint-tsgolint` are peer dependencies. Install both alongside this package. The
> config turns on type-aware linting, and oxlint looks for `oxlint-tsgolint` in your project.
> Without it, oxlint stops with `Failed to find tsgolint executable`.

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

- `categories`: `correctness: "error"`
- `overrides`: turns the `jsdoc` rules off for TypeScript files, as `@anolilab/eslint-config` does
- `overrides`: also enables the JavaScript-only rules (`no-undef` is left out because the preset sets no globals) and the JSX accessibility rules, for the file kinds `@anolilab/eslint-config` enables them for
- `plugins`: `typescript`, `unicorn`, `oxc`, `import`, `promise`, `node`, `jsdoc`, `react`, `jsx-a11y`
- `jsPlugins`: `sonarjs`, `regexp`, `eslint-comments`, `no-secrets`, `react-doctor`. ESLint plugins
  oxlint loads unchanged, with the rules `@anolilab/eslint-config` enables for them, and the
  [`oxlint-plugin-react-doctor`](https://www.npmjs.com/package/oxlint-plugin-react-doctor) rule set.
- `rules`: the rules `@anolilab/eslint-config` enables for every JS/TS file that oxlint can run,
  with ESLint's severity and options. Rules that apply only to some files (tests, markdown, JSON),
  and rules oxlint does not implement stay in ESLint.
- **Type-aware rules.** `options.typeAware` is on, so the `typescript/*` rules that need type
  information run through [`oxlint-tsgolint`](https://www.npmjs.com/package/oxlint-tsgolint). That
  package must be installed next to `oxlint`. A consumer that sets its own `options` keeps this
  setting.
- **Severity parity.** Every rule that `@anolilab/eslint-config` runs at `error` or `warn` runs here at
  the same severity. Rules from the `style`, `restriction` and `nursery` categories that ESLint enables are
  listed explicitly.
- **React Doctor.** Its rules are enabled except the 80 that oxlint already runs natively under the
  same name (for example `jsx-a11y/alt-text`, `react/rules-of-hooks`, `no-eval`), so no finding is
  reported twice. Where React Doctor is stricter than the native rule, the native rule is pinned to
  React Doctor's severity. The React Doctor rules that match an ESLint rule of the same concept are
  `error` and turn that ESLint rule off, but only when its plugin is loaded. The rest are `warn`.

The `style` category is left off as a category — formatting is the formatter's job. The rules ESLint runs from it are listed explicitly above. Pair this
with [`@anolilab/oxfmt-config`](https://anolilab.com/nodejs/packages/oxfmt-config).

`@anolilab/eslint-config` reads this file when it is present and turns off the rules it runs, so
no rule is reported twice.

## Related

- [`@anolilab/oxfmt-config`](https://anolilab.com/nodejs/packages/oxfmt-config)
- [`@anolilab/eslint-config`](https://anolilab.com/nodejs/packages/eslint-config)

[typescript-badge]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat-square
[typescript-url]: https://www.typescriptlang.org/ "TypeScript"
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license]: LICENSE.md
