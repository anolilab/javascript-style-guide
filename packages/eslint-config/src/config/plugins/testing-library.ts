import { hasPackageJsonAnyDependency } from "@visulima/package";

import type { OptionsFiles, OptionsOverrides, OptionsPackageJson } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides & OptionsPackageJson>("vitest", async (config, oFiles) => {
    const { files = oFiles, overrides, packageJson } = config;

    const testingLibraryPlugin = await interopDefault(import("eslint-plugin-testing-library"));

    const hasReact = hasPackageJsonAnyDependency(packageJson, ["react", "react-dom", "eslint-plugin-react"]);

    return [
        {
            files,
            plugins: {
                "testing-library": testingLibraryPlugin,
            },
            rules: {
                ...testingLibraryPlugin.configs["flat/dom"].rules,
                ...hasReact ? testingLibraryPlugin.configs["flat/react"].rules : {},

                ...overrides,
            },
        },
    ];
});
