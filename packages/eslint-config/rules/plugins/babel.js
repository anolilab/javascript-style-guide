const baseBestPractices = require("../best-practices");
const baseErrors = require("../errors");
const baseStyle = require("../style");

module.exports = {
    plugins: ["babel"],
    rules: {
        camelcase: "off",
        "babel/camelcase": [
            // Deep clone to avoid object mutation wierdness
            baseStyle.rules.camelcase[0],
            { ...baseStyle.rules.camelcase[1] },
        ],

        "new-cap": "off",
        "babel/new-cap": baseStyle.rules["new-cap"],

        "no-invalid-this": "off",
        "babel/no-invalid-this": baseBestPractices.rules["no-invalid-this"],

        "object-curly-spacing": "off",
        "babel/object-curly-spacing": baseStyle.rules["object-curly-spacing"],

        quotes: "off",
        "babel/quotes": baseStyle.rules.quotes,

        semi: "off",
        "babel/semi": baseStyle.rules.semi,

        "no-unused-expressions": "off",
        "babel/no-unused-expressions": baseBestPractices.rules["no-unused-expressions"],

        "valid-typeof": "off",
        "babel/valid-typeof": baseErrors.rules["valid-typeof"],
    },
};
