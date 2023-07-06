import type { Linter } from "eslint";

export {};

declare global {
    var hasAnolilabEsLintConfigLoaded: undefined | boolean;

    var hasAnolilabEsLintConfigReactRuntimePath: undefined | boolean;

    var hasAnolilabEsLintTestConfigLoaded: undefined | boolean;

    var hasAnolilabEsLintConfigPrettier: undefined | boolean;

    var hasAnolilabEsLintConfigJsyA11yStorybook: undefined | boolean;

    var hasAnolilabEsLintConfigPerfectionistTypescriptSortKeys: undefined | boolean;

    var hasAnolilabEsLintConfigPlaywrightJest: undefined | boolean;

    var hasAnolilabEsLintConfigJsoncPackageJsonSort: undefined | boolean;

    var anolilabEslintIndent: undefined | number;

    var anolilabEslintPackageJsonConfig: undefined | { [key: string]: boolean | undefined };

    var anolilabEslintConfigTypescriptPrettierRules: undefined | Linter.RulesRecord;

    var anolilabEslintConfigBabelPrettierRules: undefined | Linter.RulesRecord;

    var anolilabEslintConfigJsDocRules: undefined | Linter.Config["overrides"];

    var anolilabEslintConfigNodeRules: undefined | Linter.RulesRecord;

    var anolilabEslintConfigReactPrettierRules: undefined | Linter.RulesRecord;

    var anolilabEslintConfigHtmlPrettierRules: undefined | Linter.RulesRecord;
    var anolilabEslintConfigHtmlPrettierSettings: undefined | Linter.Config["settings"];

    var anolilabEslintConfigReactVersion: undefined | string;

    var anolilabEslintConfigTestingLibraryRuleSet: undefined | string;

    var anolilabEslintConfigUnicornPrettierRules: undefined | Linter.RulesRecord;
}
