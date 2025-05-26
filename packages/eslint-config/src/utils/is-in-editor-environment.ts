import isInGitHooksOrLintStaged from "./is-in-git-hooks-or-lint-staged";

const isInEditorEnvironment = (): boolean => {
    if (process.env["CI"]) {
        return false;
    }

    if (isInGitHooksOrLintStaged()) {
        return false;
    }

    return !!(process.env["VSCODE_PID"] ?? process.env["VSCODE_CWD"] ?? process.env["JETBRAINS_IDE"] ?? process.env["VIM"] ?? process.env["NVIM"]);
};

export default isInEditorEnvironment;
