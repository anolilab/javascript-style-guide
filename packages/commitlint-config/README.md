<div align="center">
<h1>Shareable Commitlint Configuration</h1>

A shareable commitlint configuration for enforcing consistent commit messages in your projects.

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

## Purpose

- Ensure a cohesive structure for all commits in your project with a comprehensive set of rules.
- Consistency in commit messages plays a pivotal role in fostering effective project collaboration, enhancing maintainability, and preserving project history.
- By leveraging commitlint configuration, you can effortlessly enforce a standardized structure for all commits in your project.
- This valuable tool facilitates better comprehension of the changes made and the reasoning behind them, enabling seamless understanding for your entire team.
- This configuration also includes a semantic-release configuration, which enables automated GitHub/NPM releases based on your commit messages.

## Install

```bash
npm install --dev-save @commitlint/cli @anolilab/commitlint-config
```

```sh
yarn add -D @commitlint/cli @anolilab/commitlint-config
```

```sh
pnpm add -D @commitlint/cli @anolilab/commitlint-config
```

## Usage

When installing this package for the first time, the following shareable configuration `commitlint.config.js` is automatically added to your project folder:

> Note: If the script detects an existing `commitlint.config.js` file, it will not overwrite it.

> Note: It can happen that the postinstall script dont run, then you have to add the `commitlint.config.js` manually.

```js
module.exports = {
    extends: ['@anolilab/commitlint-config'],
    rules: {
        // overwrite rules here
        // or extend rules
    },
};
```
or

```js
export default {
    extends: ['@anolilab/commitlint-config'],
    rules: {
        // overwrite rules here
        // or extend rules
    },
};
```

This extends the `@anolilab/commitlint-config` and uses its pre-defined configuration.

> Alternatively the configuration can be defined in a `commitlint.config.js`, `.commitlintrc.js`, `.commitlintrc`, `.commitlintrc.json`, `.commitlintrc.yml` file

## Commitlint Rules

The following customized rules are included in this configuration:

- `body-leading-blank`: There must be a blank line between the subject and the body.
- `body-max-line-length`: The body must not exceed 100 characters per line.
- `footer-leading-blank`: There must be a blank line between the body and the footer.
- `footer-max-line-length`: The footer must not exceed 100 characters per line.
- `header-max-length`: The header must not exceed 100 characters per line.
- `scope-case`: The scope must be lowercase and use kebab-case.
- `scope-empty`: The scope is optional.
- `subject-case`: The subject must start with a capital letter and use sentence case.
- `subject-empty`: The subject is required.
- `subject-full-stop`: The subject must not end with a period.
- `type-case`: The type must be lowercase.
- `type-empty`: The type is required.
- `type-enum`: The type must be one of the following:
  - `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  - `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation
  - `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
  - `deps`: Changes that add, update, or remove dependencies
  - `docs`: Documentation only changes
  - `feat`: A new feature
  - `fix`: A bug fix
  - `perf`: A code change that improves performance
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `revert`: Reverts a previous commit
  - `security`: A code change that improves security
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  - `test`: Adding missing tests or correcting existing tests
  - `translation`: Translation changes

and all rules from [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional).

## Add a Package.json Script

To add an NPM script for running `commitlint` use command, which will add the `lint:commits` script to the scripts section of your `package.json`.

```bash
pnpm pkg set scripts.lint:commits="pnpm commitlint --from HEAD~1 --to HEAD --verbose"
```

> For `npm` users, replace `pnpm` with `npm` in the above command.

## Husky

### Install

```bash
pnpm add -D husky is-ci
```

To add a `commit-msg` hook to your project, run the following command:

```bash
   npx husky add .husky/commit-msg 'pnpm commitlint --edit "${1}"'
```

And for `package.json`:

```bash
pnpm pkg set scripts.prepare="is-ci || husky install"
```

> For `npm` users, replace `pnpm` with `npm` in the above command.

## Test the configuration

For a first simple usage test of commitlint you can do the following:

```bash
# using pnpm
$ pnpm commitlint --from HEAD~1 --to HEAD --verbose

# or, using npx
$ npx commitlint --from HEAD~1 --to HEAD --verbose

# or, if script was added
$ pnpm lint:commits
```

This will check your last commit and return an error if invalid or a positive output if valid.

### Test the hook

You can test the hook by simply committing. If the commit message is valid, the commit will go through, otherwise you will see an error message.

Here's an example of what the error message would look like if your commit message doesn't meet the required format:

```bash
$ git commit -m "foo: this will fail"
husky > commit-msg (node v10.1.0)
No staged files match any of provided globs.
⧗   input: foo: this will fail
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]

✖   found 1 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky > commit-msg hook failed (add --no-verify to bypass)
```

If your commit message meets the required format, you should see a message like this:

```bash
$ git commit -m "feat: add new feature"
husky > commit-msg (node v10.1.0)
[master 9d41607] feat: add new feature
 1 file changed, 1 insertion(+)
```

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

[1]: https://github.com/semantic-release/commit-analyzer
[2]: https://github.com/semantic-release/release-notes-generator
[3]: https://github.com/semantic-release/changelog
[4]: https://github.com/semantic-release/github
[5]: https://github.com/semantic-release/exec
[6]: https://github.com/semantic-release/git
[7]: https://github.com/semantic-release/npm

[license-image]: https://img.shields.io/npm/l/@anolilab/semantic-release-preset?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
[npm-image]: https://img.shields.io/npm/v/@anolilab/semantic-release-preset/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@anolilab/semantic-release-preset/v/latest "npm"
