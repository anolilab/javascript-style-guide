<!-- START_PACKAGE_OG_IMAGE_PLACEHOLDER -->

<a href="https://github.com/anolilab/semantic-release" align="center">

  <img src="__assets__/package-og.svg" alt="commitlint-config" />

</a>

<h3 align="center">Anolilab´s shareable coding standard config for commitlint.</h3>

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

## Install

```sh
npm install @anolilab/commitlint-config
```

```sh
yarn add @anolilab/commitlint-config
```

```sh
pnpm add @anolilab/commitlint-config
```

## Usage

If you don't have a `commitlint.config.js` or the other supported names, we can create the file for you after installing `@anolilab/commitlint-config`, call `pnpm commitlint-config:install`.

> Alternatively the configuration can be defined in a `commitlint.config.js`, `.commitlintrc.js`, `.commitlintrc`, `.commitlintrc.json`, `.commitlintrc.yml` file

If you already have a `commitlint.config.js`, then you can extend the `commitlint.config.js`, with `@anolilab/commitlint-config`.

```js
module.exports = {
    extends: ["@anolilab/commitlint-config"],
    rules: {
        // overwrite rules here
        // or extend rules
    },
};
```

or

```js
export default {
    extends: ["@anolilab/commitlint-config"],
    rules: {
        // overwrite rules here
        // or extend rules
    },
};
```

This extends the `@anolilab/commitlint-config` and uses its pre-defined configuration.

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
pnpm pkg set scripts.prepare="is-ci || husky install || exit 0"
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

## Commitizen

When installing this package for the first time, the following shareable configuration `.czrc` is automatically added to your project folder:

> Note: If the script detects an existing `.czrc` file, it will not overwrite it.

> Note: It can happen that the postinstall script dont run, then you have to add the `.czrc` manually.

```json
{
    "path": "cz-conventional-changelog"
}
```

### Husky

To add a `prepare-commit-msg` hook to your project, run the following command:

```bash
npx husky add .husky/prepare-commit-msg 'exec < /dev/tty && npx cz --hook || true'
```

> Note: This is only a simple example. To support most cases on Linux, Mac and Windows you can use the other example below.

```bash
# if we hve a cmd that is running npx cz that means finalize and commit
FILE=commit.cmd
if test -f "$FILE"; then
    echo "$FILE exists."
    rm commit.cmd
    exit 0;
fi
# if on Windows, spawn a cmd that will run npx cz
case `uname` in
    *CYGWIN*|*MINGW*|*MSYS* )
        # Only run commitizen if no commit message was already provided.
        if [ -z "${2-}" ]; then
            export CZ_TYPE="${CZ_TYPE:-fix}"
            export CZ_MAX_HEADER_WIDTH=$COMMITLINT_MAX_WIDTH
            export CZ_MAX_LINE_WIDTH=$CZ_MAX_HEADER_WIDTH
            echo "npx cz && exit" > commit.cmd
            start commit.cmd
            exit 1;
        fi

        exit 0;;
esac
# Only run commitizen if no commit message was already provided.
if [ -z "${2-}" ]; then
    export CZ_TYPE="${CZ_TYPE:-fix}"
    export CZ_MAX_HEADER_WIDTH=$COMMITLINT_MAX_WIDTH
    export CZ_MAX_LINE_WIDTH=$CZ_MAX_HEADER_WIDTH
    # By default git hooks are not interactive. exec < /dev/tty allows a users terminal to interact with commitizen.
    exec < /dev/tty && npx cz --hook || true
fi
```

> This command allows the user to use their terminal to interact with Commitizen during the hook.
>
> Why `exec < /dev/tty?` By default, git hooks are not interactive.
>
> Note: If you are using `zsh` you may need to use `exec < /dev/tty?` instead of `exec < /dev/tty`.
>
> Note: For pnpm users, replace `npx` with `pnpx` in the above command.

Congratulations! Your repo is Commitizen friendly. Time to flaunt it!

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

The anolilab commitlint-config is open-sourced software licensed under the [MIT][license-url]

<!-- badges -->

[license-badge]: https://img.shields.io/npm/l/@anolilab/commitlint-config?style=for-the-badge
[license]: https://github.com/anolilab/javascript-style-guide/blob/main/LICENSE
[npm-downloads-badge]: https://img.shields.io/npm/dm/@anolilab/commitlint-config?style=for-the-badge
[npm-downloads]: https://www.npmjs.com/package/@anolilab/commitlint-config
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge
[prs-welcome]: https://github.com/anolilab/javascript-style-guide/blob/main/.github/CONTRIBUTING.md
[chat-badge]: https://img.shields.io/discord/902465130518949899.svg?style=for-the-badge
[chat]: https://discord.gg/4VuvwWGaaB
[typescript-badge]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: https://www.typescriptlang.org/
[license-url]: https://opensource.org/licenses/MIT
