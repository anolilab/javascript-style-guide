<!-- START_PACKAGE_OG_IMAGE_PLACEHOLDER -->

<a href="https://github.com/anolilab/semantic-release" align="center">

  <img src="__assets__/package-og.svg" alt="lint-staged-config" />

</a>

<h3 align="center">Shareable Lint-Staged Config for any project.</h3>

<!-- END_PACKAGE_OG_IMAGE_PLACEHOLDER -->

<br />

<div align="center">

[![typescript-image][typescript-badge]][typescript-url]
[![mit licence][license-badge]][license]
[![npm downloads][npm-downloads-badge]][npm-downloads]
[![Chat][chat-badge]][chat]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]

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

Simplify your project setup with our comprehensive collection of preconfigured configuration files.
Designed for effortless integration, these ready-to-use files can be seamlessly imported into your projects.
These functions streamline the utilization of [lint-staged][lint-staged] / [nano-staged][nano-staged] alongside popular tools such as [ESLint](https://eslint.org), [Prettier](https://prettier.io), [StyleLint](https://stylelint.io) and [SecretLint](https://github.com/secretlint/secretlint).

Say goodbye to complex configurations and enjoy a smoother development experience with our all-inclusive package.

## Purpose

- Enhance your development workflow with hassle-free and readily shareable lint-staged / nano-staged configuration files.
- These files empower developers to maintain a uniform coding style and detect prevalent errors even before they are added to the source control system.
- Additionally, our inclusive helper module offers convenient utility functions that seamlessly integrate lint-staged with popular linting and formatting tools.

## Install

```sh
npm install @anolilab/lint-staged-config
```

```sh
yarn add @anolilab/lint-staged-config
```

```sh
pnpm add @anolilab/lint-staged-config
```

## Usage

If you don't have a `.lintstagedrc.js` or `.nano-staged.js`, we can create the file for you after installing `@anolilab/lint-staged-config`, call `pnpm lint-stage-config:install`.

If you already have a `.lintstagedrc.js` or `.nano-staged.js`, then you can extend the `.lintstagedrc.js` or `.nano-staged.js`, with `@anolilab/lint-staged-config`.

> Note: If the script detects an existing `.lintstagedrc.js` or `.nano-staged.js` file, it will not overwrite it.

The content of the `.lintstagedrc.js` or `.nano-staged.js` should look like this:

```js
// or

import { defineConfig } from "@anolilab/lint-staged-config";

const { defineConfig } = require("@anolilab/lint-staged-config");

module.exports = defineConfig();

export default defineConfig();
```

### Config

You can configure `@anolilab/lint-staged-config` options inside the `defineConfig` function.

```js
// or

import { defineConfig } from "@anolilab/lint-staged-config";

const { defineConfig } = require("@anolilab/lint-staged-config");

module.exports = defineConfig({
    // Add your configuration here
});

export default defineConfig({
    // Add your configuration here
});
```

## Configuration

The default configuration, automatically adds the following linting and formatting tools, if the needed dependencies are installed.

- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [StyleLint](https://stylelint.io)
- [SecretLint]()
- [CommitLint](https://commitlint.js.org)
- [Vitest](https://vitest.dev) or [Jest](https://jestjs.io) or [AVA](https://github.com/avajs/ava)
- [TypeScript](https://www.typescriptlang.org)

All this tools configuration are exported at `@anolilab/lint-staged-config/group/...` and
can be used to extend your configuration, without including the auto config.

## Husky

If you want to use [husky](https://github.com/typicode/husky) to run the lint-staged script, you can use the following configuration.

Adding the following script to your root `package.json` file makes it easier to run the husky command:

```bash
pnpm pkg set scripts.prepare="is-ci || husky install || exit 0"
```

This script will install husky only if it is not running in a CI environment.

After that you can find a `.husky` folder in your root directory, with a `pre-commit` (if not please create it) file.

The file content can look like this:

```bash
#!/bin/sh

. "$(dirname "$0")/_/husky.sh"

# The hook should exit with non-zero status after issuing
# an appropriate message if it wants to stop the commit.

echo --------------------------------------------
echo Starting Git hook: pre-commit

./node_modules/.bin/lint-staged --verbose --concurrent false

echo Finished Git hook: pre-commit
echo --------------------------------------------
```

or with `nano-staged`:

```bash
#!/bin/sh

. "$(dirname "$0")/_/husky.sh"

# The hook should exit with non-zero status after issuing
# an appropriate message if it wants to stop the commit.

echo --------------------------------------------
echo Starting Git hook: pre-commit

./node_modules/.bin/nano-staged

echo Finished Git hook: pre-commit
echo --------------------------------------------
```

Our package includes a `lint-stage-config:install` command to add the `pre-commit`, `common.sh`, `prepare-commit-msg hooks to your `.husky` folder.

If `commitzen` is installed, the `prepare-commit-msg` hook with predefined content will be added to your `.husky` folder.

## Related

## Supported Node.js Versions

Libraries in this ecosystem make the best effort to track [Node.js' release schedule](https://github.com/nodejs/release#release-schedule).

Here's [a post on why we think this is important](https://medium.com/the-node-js-collection/maintainers-should-consider-following-node-js-release-schedule-ab08ed4de71a).

## Contributing

If you would like to help take a look at the [list of issues](https://github.com/anolilab/javascript-style-guide/issues) and check our [Contributing](.github/CONTRIBUTING.md) guidelines.

> **Note:** please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Credits

-   [Daniel Bannert](https://github.com/prisis)

-   [All Contributors](https://github.com/anolilab/javascript-style-guide/graphs/contributors)

## Made with ❤️ at Anolilab

This is an open source project and will always remain free to use. If you think it's cool, please star it 🌟. [Anolilab](https://www.anolilab.com/open-source) is a Development and AI Studio. Contact us at [hello@anolilab.com](mailto:hello@anolilab.com) if you need any help with these technologies or just want to say hi!

## License

The anolilab lint-staged-config is open-sourced software licensed under the [MIT][license-url]

<!-- badges -->

[license-badge]: https://img.shields.io/npm/l/@anolilab/lint-staged-config?style=for-the-badge
[license]: https://github.com/anolilab/javascript-style-guide/blob/main/LICENSE
[npm-downloads-badge]: https://img.shields.io/npm/dm/@anolilab/lint-staged-config?style=for-the-badge
[npm-downloads]: https://www.npmjs.com/package/@anolilab/lint-staged-config
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge
[prs-welcome]: https://github.com/anolilab/javascript-style-guide/blob/main/.github/CONTRIBUTING.md
[chat-badge]: https://img.shields.io/discord/902465130518949899.svg?style=for-the-badge
[chat]: https://discord.gg/4VuvwWGaaB
[typescript-badge]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: https://www.typescriptlang.org/
[license-url]: https://opensource.org/licenses/MIT
[lint-staged]: https://github.com/okonet/lint-staged
[nano-staged]: https://github.com/usmanyunusov/nano-staged
