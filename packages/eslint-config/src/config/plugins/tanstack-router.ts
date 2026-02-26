import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginTanstackRouter = await interopDefault(import("@tanstack/eslint-plugin-router"));

    return [
        {
            files,
            plugins: {
                "@tanstack/router": pluginTanstackRouter,
            },
            rules: {
                ...pluginTanstackRouter.configs["recommended"].rules,
                ...overrides,
            },
        },
        {
            files: ["**/routes/**/*.{ts,tsx}"],
            rules: {
                // Tanstack Router uses a custom sort order for objects
                "perfectionist/sort-objects": "off",

                // TanStack Router route files export a `Route` object (createFileRoute result),
                // loaders, and other non-component values — not just React components.
                // Disabling avoids false positives from react-refresh HMR rule.
                "react-refresh/only-export-components": "off",
            },
        },
    ];
});
