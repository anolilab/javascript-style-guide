import { defineConfig } from "taze";

export default defineConfig({
    ignorePaths: [
        "node_modules",
        "packages/**/dist",
        "packages/**/coverage",
        "packages/**/__fixtures__",
        "packages/**/__tests__",
    ],
    mode: "latest",
    recursive: true,
    // write to package.json
    write: true,
});
