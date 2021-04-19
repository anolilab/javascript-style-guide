import { rules as _rules } from '../best-practices';
import { rules as __rules } from '../errors';
import { rules as ___rules } from '../style';

const babel = {
    plugins: ['babel'],
    rules: {
        camelcase: 'off',
        'babel/camelcase': [
            // Deep clone to avoid object mutation wierdness
            ___rules.camelcase[0],
            { ...___rules.camelcase[1] },
        ],

        'new-cap': 'off',
        'babel/new-cap': ___rules['new-cap'],

        'no-invalid-this': 'off',
        'babel/no-invalid-this': _rules['no-invalid-this'],

        'object-curly-spacing': 'off',
        'babel/object-curly-spacing': ___rules['object-curly-spacing'],

        quotes: 'off',
        'babel/quotes': ___rules.quotes,

        semi: 'off',
        'babel/semi': ___rules.semi,

        'no-unused-expressions': 'off',
        'babel/no-unused-expressions': _rules['no-unused-expressions'],

        'valid-typeof': 'off',
        'babel/valid-typeof': __rules['valid-typeof'],
    }
}

export default babel
