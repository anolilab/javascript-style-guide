import anolilabEslintConfig from "./eslint-config";

if (global.anolilabEslintIndent === undefined && anolilabEslintConfig["indent"]) {
    if (Number.isNaN(anolilabEslintConfig["indent"])) {
        throw new TypeError("Indent must be a number");
    }

    global.anolilabEslintIndent = Number(anolilabEslintConfig["indent"]);
} else {
    global.anolilabEslintIndent = 4;
}

const indent = global.anolilabEslintIndent;

export default indent;
