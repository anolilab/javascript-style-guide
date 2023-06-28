import type { Linter } from "eslint";

export {};

declare global {
    var hasAnolilabEsLintConfigLoaded: boolean;

    var hasAnolilabEsLintConfigReactRuntimePath: boolean;

    var hasAnolilabEsLintTestConfigLoaded: boolean;

    var hasAnolilabEsLintConfigPrettier: boolean;

    var hasAnolilabEsLintConfigJsyA11yStorybook: boolean;

    var hasAnolilabEsLintConfigPlaywrightJest: boolean;

    var hasAnolilabEsLintConfigYamlPrettier: boolean;

    var anolilabEslintPackageJsonConfig: undefined | { [key: string]: boolean | undefined };

    var anolilabEslintConfigTypescriptPrettierRules: undefined | Linter.RulesRecord;

    var anolilabEslintConfigBabelPrettierRules: undefined | Linter.RulesRecord;

    var anolilabEslintConfigJsDocRules: undefined | Linter.Config["overrides"];

    var anolilabEslintConfigNodeRules: undefined | Linter.RulesRecord;

    var anolilabEslintConfigReactPrettierRules: undefined | Linter.RulesRecord;

    var anolilabEslintConfigTestingLibraryRuleSet: undefined | string;

    var anolilabEslintConfigUnicornPrettierRules: undefined | Linter.RulesRecord;
}
