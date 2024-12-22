import isInGitHooksOrLintStaged from "./is-in-git-hooks-or-lint-staged";

const isInEditorEnv = (): boolean => {
    if (process.env.CI) {
        return false;
    }

    if (isInGitHooksOrLintStaged()) {
        return false;
    }

    return !!(false || process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM || process.env.NVIM);
};

export default isInEditorEnv;
