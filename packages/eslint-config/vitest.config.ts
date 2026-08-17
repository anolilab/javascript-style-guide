import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["__tests__/**/*.{test,spec}.ts"],
        // Each rules test spawns ESLint over a fixture tree; ~20-30s locally, slower in CI.
        testTimeout: 120_000,
    },
});
