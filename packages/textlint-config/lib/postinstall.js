#!/usr/bin/env node

import { existsSync, writeFile } from "node:fs";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

// eslint-disable-next-line no-undef
if (process.env.CI) {
    // eslint-disable-next-line no-undef
    process.exit(0);
}

const writeFileAsync = promisify(writeFile);

// get the path to the host project.
// eslint-disable-next-line no-undef
const projectPath = resolve(process.cwd(), "..", "..", "..");

console.log("Configuring @anolilab/textlint-config", projectPath, "\n");

/**
 * Writes .textlintrc if it doesn't exist. Warns if it exists.
 */
const writeTextlintRc = () => {
    const eslintPath = join(projectPath, ".textlintrc");
    const content = `{
  "filters": {
    "comments": true
  },
  "rules": {
    "@textlint-rule/no-invalid-control-character": true,
    "@textlint-rule/no-unmatched-pair": true,
    "@textlint-rule/preset-google": true,
    "abbr-within-parentheses": true,
    "apostrophe": true,
    "alex": {
        "allow": [
            "attack",
            "european",
            "execute"
            "executed",
            "execution",
            "failure",
            "fore",
            "period",
            "remain",
        ]
    },
    "common-misspellings": true,
    "date-weekday-mismatch": true
    "diacritics": true,
    "en-capitalization": true,
    "footnote-order": true,
    "no-dead-link": {
        "ignore": [
            "bc_data_*",
        ]
    },
    "no-empty-section": true,
    "no-todo": true,
    "terminology": true,
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
        ["\\\\(s\\\\)he", "they"],
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
    },
    "write-good": {
      "passive": false,
      "eprime": false,
    }
  }
}
`;

    if (existsSync(eslintPath)) {
        console.warn(`⚠️  .textlintrc already exists;
Make sure that it includes the following for @anolilab/textlint-config'
to work as it should: ${content}.`);

        return Promise.resolve();
    }

    return writeFileAsync(eslintPath, content, "utf-8");
};

/**
 * Writes .textlintignore if it doesn't exist. Warns if it exists.
 */
const writeTextlintIgnore = () => {
    const eslintPath = join(projectPath, ".textlintignore");
    const content = "";

    if (existsSync(eslintPath)) {
        console.warn("⚠️  .textlintignore already exists;");

        return Promise.resolve();
    }

    return writeFileAsync(eslintPath, content, "utf-8");
};

(async () => {
    try {
        await writeTextlintRc();
        await writeTextlintIgnore();

        console.log("😎  Everything went well, have fun!");

        // eslint-disable-next-line no-undef
        process.exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error.message);

        // eslint-disable-next-line no-undef
        process.exit(1);
    }
})();
