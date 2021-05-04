const bestPractices = require('../best-practices.cjs');
const errors = require('../errors.cjs');
const style = require('../style.cjs');

module.exports = {
    plugins: ['babel'],
    rules: {
        camelcase: 'off',
        'babel/camelcase': [
            // Deep clone to avoid object mutation wierdness
            style.camelcase[0],
            { ...style.camelcase[1] },
        ],

        'new-cap': 'off',
        'babel/new-cap': style['new-cap'],

        'no-invalid-this': 'off',
        'babel/no-invalid-this': bestPractices['no-invalid-this'],

        'object-curly-spacing': 'off',
        'babel/object-curly-spacing': style['object-curly-spacing'],

        quotes: 'off',
        'babel/quotes': style.quotes,

        semi: 'off',
        'babel/semi': style.semi,

        'no-unused-expressions': 'off',
        'babel/no-unused-expressions': bestPractices['no-unused-expressions'],

        'valid-typeof': 'off',
        'babel/valid-typeof': errors['valid-typeof'],
    }
}
