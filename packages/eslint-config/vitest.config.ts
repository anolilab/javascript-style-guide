import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["__tests__/**/*.{test,spec}.ts"],
        testTimeout: 60_000,
    },
});
