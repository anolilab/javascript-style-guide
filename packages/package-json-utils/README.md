# Javascript Style Guide Utils

Shared utilities for parsing information from a package.json file.

<div align="center">

[![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

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
npm install @anolilab/package-json-utils
```

```sh
yarn add @anolilab/package-json-utils
```

```sh
pnpm add @anolilab/package-json-utils
```

## Usage

```js
const { pkg } = require('@anolilab/package-json-utils');

console.log(pkg.name); // will print the name of the "process.cwd()" package.json
```

List of available helpers:

- hasPackageProperties
  > This function takes an array of property names as input and checks if the "process.cwd()" package.json object has any of those properties.

- hasPackageSubProperties
  > This function takes a package property name as input and returns a new function that checks if the "process.cwd()" package.json object has sub-properties under the specified package property.

- environmentIsSet
  > This function takes an environment variable name as input and checks if the environment variable is set and not equal to "undefined".

- parseEnvironment
  > This function takes an environment variable name and a default value as input. It attempts to parse the value of the environment variable as JSON and returns the parsed value. If parsing fails, it returns the original value as a string.

- appDirectory
  > This variable is assigned the value of the directory name of the package path or an empty string if the package path is undefined.

- fromRoot
  > This function takes a variable number of path segments as input and joins them with the appDirectory to create a complete path from the root directory.

- hasFile
  > This function takes a variable number of path segments as input and checks if a file exists at the specified path relative to the appDirectory.

- hasScripts
  > This variable is assigned the result of calling hasPackageSubProperties with the argument "scripts". It checks if the "process.cwd()" package.json object has any scripts defined.

- hasPeerDep
  > This variable is assigned the result of calling hasPackageSubProperties with the argument "peerDependencies". It checks if the "process.cwd()" package.json object has any peer dependencies defined.

- hasDep
  > This variable is assigned the result of calling hasPackageSubProperties with the argument "dependencies". It checks if the "process.cwd()" package.json object has any regular dependencies defined.

- hasDevelopmentDep
  > This variable is assigned the result of calling hasPackageSubProperties with the argument "devDependencies". It checks if the "process.cwd()" package.json object has any development dependencies defined.

- hasAnyDep
  > This function takes an array of dependency names as input and checks if any of the dependency checks (hasDep, hasDevelopmentDep, hasPeerDep) return true for any of the dependencies.

- hasTypescript
  > This variable is assigned the result of checking if "typescript" is a dependency and if "tsconfig.json" file exists using hasAnyDep and hasFile functions.

- packageIsTypeModule
  > This variable is assigned the result of checking if the "process.cwd()" package.json object has a property "type" and its value is "module".

- isPackageAvailable
  > This function takes a module name as input and checks if the module is available for import. It uses different methods depending on the environment and package type (module or commonjs).

- showMissingPackages
  > This function takes a package name and an array of missing package names as input and logs a warning message with instructions on how to install the missing packages using npm, yarn, or pnpm.

- unique
  > This function takes an array as input and returns a new array with only unique values.

- pkg
  > This variable returns the "process.cwd()" package.json object or undefined.

> **Note:** The process.cwd() method is an inbuilt application programming interface of the process module
which is used to get the current working directory of the node.js process.

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

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[license-image]: https://img.shields.io/npm/l/@anolilab/package-json-utils?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"
[npm-image]: https://img.shields.io/npm/v/@anolilab/package-json-utils/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@anolilab/package-json-utils/v/latest "npm"
