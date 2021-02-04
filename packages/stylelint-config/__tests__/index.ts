import path from 'path';
import stylelint from 'stylelint';

describe('flags no warnings with valid css', () => {
    let result;

    beforeEach(() => {
        result = stylelint.lint({
            files: [
                path.join(__dirname, '/../__fixture__/BlockNoEmpty.js'),
                path.join(__dirname, '/../__fixture__/CommentEmptyLineBefore.js'),
            ],
            configFile: path.join(__dirname, '/../index.js'),
        });
    });

    it('did not error', () => {
        return result.then((data) => {
            expect(data.errored).toBeFalsy();
        });
    });

    it('flags no warnings', () => {
        return result.then((data) => expect(data.results[0].warnings).toHaveLength(0));
    });
});

describe('flags warnings with invalid css', () => {
    let result;

    beforeEach(() => {
        result = stylelint.lint({
            files: [
                path.join(__dirname, '/../__fixture__/DeclarationBlockNoDuplicateProperties.js'),
            ],
            configFile: path.join(__dirname, '/../index.js'),
        });
    });

    it('did error', () => {
        return result.then((data) => expect(data.errored).toBeTruthy());
    });

    it('flags one warning', () => {
        return result.then((data) => expect(data.results[0].warnings).toHaveLength(1));
    });
});
