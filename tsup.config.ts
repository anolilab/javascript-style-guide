import type { NormalizedPackageJson, NormalizeOptions } from "read-pkg";
import { readPackageSync } from "read-pkg";
import type { Options } from "tsup";
import { defineConfig as baseDefineConfig } from "tsup";

import tsconfig from "./tsconfig.json";

function getPackageSources(packageContent: NormalizedPackageJson) {
    if (typeof packageContent["source"] === "string") {
        return [packageContent["source"]];
    }

    if (Array.isArray(packageContent["sources"])) {
        return packageContent["sources"];
    }

    throw new TypeError("Please define a source or sources key in the package.json.");
}

// @ts-expect-error
export const createConfig = (config?: Object & Options) =>
    baseDefineConfig((options: Options) => {
        const packageJsonContent = readPackageSync(options as NormalizeOptions);

        const sources = getPackageSources(packageJsonContent);
        const peerDependenciesKeys = Object.keys(packageJsonContent.peerDependencies || {});

        return {
            ...options,
            entry: sources,
            treeshake: true,
            // react external https://github.com/vercel/turborepo/issues/360#issuecomment-1013885148
            external: [
                ...new Set([
                    ...peerDependenciesKeys,
                    ...Object.keys(packageJsonContent.optionalDependencies || {}),
                    ...(config?.external || []),
                ]),
            ],
            format: ["esm", "cjs"],
            silent: !options.watch,
            minify: process.env.NODE_ENV === "production",
            incremental: !options.watch,
            dts: true,
            sourcemap: true,
            clean: true,
            splitting: true,
            target: tsconfig.compilerOptions.target as "es2021",
            env: {
                NODE_ENV: process.env.NODE_ENV,
                ...config?.env,
            },
            declaration: true,
            esbuildOptions(options) {
                if (process.env.NODE_ENV !== "production" && peerDependenciesKeys.includes("react")) {
                    options.tsconfig = options.tsconfig?.replace("tsconfig.json", "tsconfig.dev.json");
                }
            },
            ...config,
        };
    });
