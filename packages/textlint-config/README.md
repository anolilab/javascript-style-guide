# Text-lint Config

Anolilab Coding Standard for text linting.

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

```bash
npm install --dev-save @anolilab/textlint-config textlint
```

## Usage

If you don’t have a `.textlintrc`, we will create the file for you after installing `@anolilab/textlint-config`.

If you already have a `.textlintrc`, then you can extend the `.textlintrc`, with `@anolilab/textlint-config`.

```text
{
  "filters": {
    "comments": true
  },
  "rules": {
    "en-capitalization": true,
    "footnote-order": true,
    "no-todo": true,
    "no-dead-link": {
        "ignore": [
            "bc_data_*",
        ]
    },
    "no-empty-section": true,
    "terminology": true,
    "apostrophe": true,
    "diacritics": true,
    "@textlint-rule/no-invalid-control-character": true,
    "@textlint-rule/no-unmatched-pair": true,
    "abbr-within-parentheses": true,
    "alex": {
        "allow": [
            "period",
            "european",
            "failure",
            "fore",
            "attack",
            "execution",
            "executed",
            "remain",
            "execute"
        ]
    },
    "@textlint-rule/preset-google": true,
    "write-good": {
      "passive": false,
      "eprime": false,
    },
    "common-misspellings": true,
    "terminology": {
      "defaultTerms": false,
      "terms": [
        // Abbreviations
        "API",
        ["API['’]?s", "APIs"],
        "Ajax",
        "CLI",
        "CSS",
        "CORS",
        ["^E2E", "E2E"],
        "gif",
        ["^HTML", "HTML"],
        ["^URL(s?)", "URL$1"],
        ["^HTTP", "HTTP"],
        ["^HTTPS", "HTTPS"],
        "SSO",
        ["^XHR(s?)", "XHR$1"],
        ["^XHR['’]?s", "XHRs"],
        "Xvfb",
        "YAML",

        // Words and phrases
        ["\\(s\\)he", "they"],
        ["he or she", "they"],
        ["he/she", "they"],
        ["crazy", "complex"],
        ["crazier", "more complex"],
        ["craziest", "most complex"],
        ["dumb", "unintended"],
        ["insane", "outrageous"],

        // Prefer American spelling
        ["behaviour", "behavior"],
        ["cancelled", "canceled"],
        ["cancelling", "canceling"],
        ["centre", "center"],
        ["colour", "color"],
        ["customise", "customize"],
        ["customisation", "customization"],
        ["favourite", "favorite"],
        ["labelled", "labeled"],
        ["licence", "license"],
        ["organise", "organize"],

        // Common misspellings
        ["gaurantee", "guarantee"],

        // Words we would like to not use altogether
        ["simply", ""],

        // Single word
        ["change[- ]log(s?)", "changelog$1"],
        ["code[- ]base(es?)", "codebase$1"],
        ["e[- ]mail(s?)", "email$1"],
        ["end[- ]point(s?)", "endpoint$1"],
        ["file[- ]name(s?)", "filename$1"],
        ["can[- ]not", "cannot$1"],

        // Multiple words
        ["back-?end(s?)", "back end$1"],
        ["front-?end(s?)", "front end$1"],
        ["full-?stack(s?)", "full stack$1"],
        ["open-?source(ed?)", "open source$1"],
        ["web-?page(s?)", "web page$1"],

        // Hyphenated
        ["end ?to ?end", "end-to-end"],
        ["retryability", "retry-ability"],
        ["retriability", "retry-ability"],

        ["some", ""],
        ["filetype", "file type"],
        ["stylesheet", "style sheet"],
        ["like this", ""],
        ["probably", ""],
        ["known as", ""],
        ["really", ""],
        ["just", ""],
        ["simple", ""],
        ["obvious", ""],
        ["straightforward", ""],
        ["very", ""],
        ["a little", ""],
        ["note that", ""],
        ["good to note", ""],
        ["good to remember", ""],
        ["basically", ""],
        ["actually", ""],
        ["pretty", ""],
        ["easy", ""],
        ["interesting", ""],
        ["way to", ""],
        ["In order to", "To"],
        ["in order to", "to"],
        ["might", ""],
        ["us", ""],
        ["I'll", ""],
        ["I've", ""],
        ["they'll", ""],
        ["it is", "it's"],
        ["It is", "It's"],
      ]
    }
  }
}
```

## Supported Node.js Versions

Libraries in this ecosystem make the best effort to track
[Node.js’ release schedule](https://nodejs.org/en/about/releases/). Here’s [a
post on why we think this is important](https://medium.com/the-node-js-collection/maintainers-should-consider-following-node-js-release-schedule-ab08ed4de71a).

## Contributing

If you would like to help take a look at the [list of issues](https://github.com/anolilab/javascript-style-guide/issues) and check our [Contributing](.github/CONTRIBUTING.md) guild.

> **Note:** please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Credits

-   [Daniel Bannert](https://github.com/prisis)
-   [All Contributors](https://github.com/anolilab/javascript-style-guide/graphs/contributors)

## License

The anolilab javascript-style-guide is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT)
