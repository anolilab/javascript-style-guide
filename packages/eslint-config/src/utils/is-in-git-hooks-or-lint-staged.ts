const isInGitHooksOrLintStaged = (): boolean =>
    Boolean(
        process.env["GIT_PARAMS"] ??
            process.env["VSCODE_GIT_COMMAND"] ??
            process.env["npm_lifecycle_script"]?.startsWith("lint-staged") ??
            false,
    );

export default isInGitHooksOrLintStaged;
