const { rules: baseBestPracticesRules } = require('../best-practices.cjs');
const { rules: errorsRules } = require('../errorsRules.cjs');
const { rules: styleRules } = require('../styleRules.cjs');

module.exports = {
    plugins: ['babel'],
    rules: {
        camelcase: 'off',
        'babel/camelcase': [
            // Deep clone to avoid object mutation wierdness
            styleRules.camelcase[0],
            { ...styleRules.camelcase[1] },
        ],

        'new-cap': 'off',
        'babel/new-cap': styleRules['new-cap'],

        'no-invalid-this': 'off',
        'babel/no-invalid-this': baseBestPracticesRules['no-invalid-this'],

        'object-curly-spacing': 'off',
        'babel/object-curly-spacing': styleRules['object-curly-spacing'],

        quotes: 'off',
        'babel/quotes': styleRules.quotes,

        semi: 'off',
        'babel/semi': styleRules.semi,

        'no-unused-expressions': 'off',
        'babel/no-unused-expressions': baseBestPracticesRules['no-unused-expressions'],

        'valid-typeof': 'off',
        'babel/valid-typeof': errorsRules['valid-typeof'],
    }
}
