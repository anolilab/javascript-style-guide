const isInGitHooksOrLintStaged = (): boolean => {
    return !!(process.env["GIT_PARAMS"] || process.env["VSCODE_GIT_COMMAND"] || process.env["npm_lifecycle_script"]?.startsWith("lint-staged"));
};

export default isInGitHooksOrLintStaged;
