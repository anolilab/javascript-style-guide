/**
 * Shared oxlint configuration for Anolilab.
 *
 * The canonical config lives in `.oxlintrc.json` at the package root so it can be consumed two ways:
 * from a consumer `.oxlintrc.json` that `extends` the file by path (oxlint JSON configs cannot
 * import npm packages), or from `oxlint.config.ts` as the imported object re-exported here.
 * @see https://oxc.rs/docs/guide/usage/linter/config
 * @see https://github.com/anolilab/javascript-style-guide/tree/main/packages/oxlint-config#readme
 */

import { dirname } from "node:path";

import { readTsConfig } from "@visulima/tsconfig";

export { default } from "../.oxlintrc.json";

/**
 * Turns `react/react-in-jsx-scope` off for the files under every tsconfig that sets `jsx` to
 * `react-jsx` or `react-jsxdev`, as `@anolilab/eslint-config` does. oxlint JSON cannot read a
 * tsconfig, so this runs from `oxlint.config.ts`; add the result to that config's `overrides`.
 * @param tsconfigPaths tsconfig paths relative to the directory that holds the oxlint config
 */
export const jsxRuntimeOverrides = (tsconfigPaths: string[]): { files: string[]; rules: Record<string, "off"> }[] =>
    tsconfigPaths.flatMap((tsconfigPath) => {
        const { jsx } = readTsConfig(tsconfigPath).compilerOptions ?? {};

        if (jsx !== "react-jsx" && jsx !== "react-jsxdev") {
            return [];
        }

        // oxlint treats a backslash in a glob as an escape, so Windows separators must become "/".
        const directory = dirname(tsconfigPath).replaceAll("\\", "/");

        return [{ files: [directory === "." ? "**" : `${directory}/**`], rules: { "react/react-in-jsx-scope": "off" } }];
    });
