import consoleLog from "./utils/logger";

export {};

declare global {
    var hasAnolilabStagedLintConfigLoaded: undefined | boolean;

    var anolilabLintStagedPackageJsonConfig: undefined | { [key: string]: boolean | undefined };

    var hasAnolilabLintStagedMarkdownCli: undefined | boolean;

    var hasAnolilabLintStagedMarkdownCli2: undefined | boolean;
}
