import type { TypedFlatConfigItem } from "../types";
import { getFilesGlobs } from "../utils/create-config";

export const ignores = async (userIgnores: string[] | ((originals: string[]) => string[]) = [], ignoreTypeScript = false): Promise<TypedFlatConfigItem[]> => {
    let patterns = [
        "**/node_modules",
        "**/dist",
        "**/package-lock.json",
        "**/yarn.lock",
        "**/pnpm-lock.yaml",
        "**/bun.lockb",
        "**/.npmignore",

        "**/output",
        "**/coverage",
        "**/temp",
        "**/.temp",
        "**/tmp",
        "**/.tmp",
        "**/.history",
        "**/.vitepress/cache",
        "**/.nuxt",
        "**/.next",
        "**/.svelte-kit",
        "**/.vercel",
        "**/.changeset",
        "**/.idea",
        "**/.cache",
        "**/.output",
        "**/.vite-inspect",
        "**/.yarn",
        "**/vite.config.*.timestamp-*",

        "**/CHANGELOG*.md",
        "**/*.min.*",
        "**/LICENSE*",
        "**/__snapshots__",
        "**/auto-import?(s).d.ts",
        "**/components.d.ts",

        "{tmp,temp}/**",
        "**/*.min.js",
        "**/dist/**",
        "**/node_modules/**",
        "**/vendor/**",
        "**/.cache/**",

        // Ignore VitePress cache
        "**/.vitepress",

        // Ignore AI assistant documentation files
        "**/CLAUDE.md",
        "**/.claude",
        "**/AI.md",
        "**/AGENT.md",
        "**/PROMPT.md",
        "**/PROMPTING.md",

        // Cursor IDE
        "**/.cursorrules",
        "**/.cursorignore",
        "**/.cursormem.json",
        "**/.cursorhistory",

        // GitHub Copilot
        "**/copilot.json",
        "**/copilot.config.json",
        "**/copilot.md",
    ];

    if (ignoreTypeScript) {
        patterns.push(...getFilesGlobs("ts"));
    }

    patterns = typeof userIgnores === "function" ? userIgnores(patterns) : [...patterns, ...userIgnores];

    return [
        {
            ignores: patterns,
            name: "anolilab/ignores",
        },
    ];
};

export default ignores;
