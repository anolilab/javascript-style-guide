import type { Linter } from "eslint";

const parserPlain: Linter.Parser = {
    meta: {
        name: "parser-plain",
    },
    parseForESLint: (code: string) => ({
        ast: {
            body: [],
            comments: [],
            loc: { end: code.length, start: 0 },
            range: [0, code.length],
            tokens: [],
            type: "Program",
        },
        scopeManager: undefined,
        services: { isPlain: true },
        visitorKeys: {
            Program: [],
        },
    }),
};

export default parserPlain;
