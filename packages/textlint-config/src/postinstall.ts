import { existsSync, writeFile } from "node:fs";
import { join } from "node:path";
import { env, exit } from "node:process";
import { promisify } from "node:util";

import { projectPath } from "@anolilab/package-json-utils";

if (env["CI"] !== undefined) {
    exit(0);
}

const writeFileAsync = promisify(writeFile);

console.log("Configuring @anolilab/textlint-config", projectPath, "\n");

/**
 * Writes .textlintrc if it doesn't exist. Warns if it exists.
 */
const writeTextLintRc = async () => {
    const filePath = join(projectPath, ".textlintrc");
    const content = `{
    "@textlint/markdown": {
        "extensions": [".md", ".mdx"]
    },
    "filters": {
        "comments": true
    },
    "rules": {
        "en-capitalization": true,
        "footnote-order": true,
        "no-todo": true,
        "no-dead-link": {
            "ignore": ["bc_data_*"]
        },
        "no-empty-section": true,
        "terminology": true,
        "apostrophe": true,
        "diacritics": true,
        "@textlint-rule/no-invalid-control-character": true,
        "@textlint-rule/no-unmatched-pair": true,
        "abbr-within-parentheses": true,
        "alex": {
            "allow": ["period", "european", "failure", "fore", "attack", "execution", "executed", "remain", "execute"]
        },
        "@textlint-rule/preset-google": true,
        "write-good": {
            "passive": false,
            "eprime": false
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
                ["It is", "It's"]
            ]
        }
    }
}
`;

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(filePath)) {
        console.warn(`⚠️  .textlintrc already exists;
Make sure that it includes the following for @anolilab/textlint-config'
to work as it should: ${content}.`);

        return;
    }

    await writeFileAsync(filePath, content, "utf-8");
};

/**
 * Writes .textlintignore if it doesn't exist. Warns if it exists.
 */
const writeTextLintIgnore = async () => {
    const filePath = join(projectPath, ".textlintignore");
    const content = "";

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(filePath)) {
        console.warn("⚠️  .textlintignore already exists;");

        return;
    }

    await writeFileAsync(filePath, content, "utf-8");
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        await writeTextLintRc();
        await writeTextLintIgnore();

        console.log("😎  Everything went well, have fun!");

        exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error);

        exit(1);
    }
})();
