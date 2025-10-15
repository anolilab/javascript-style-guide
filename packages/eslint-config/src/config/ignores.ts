import type { TypedFlatConfigItem } from "../types";

const ignores = async (
    userIgnores: string[] = [],
): Promise<TypedFlatConfigItem[]> => [
    {
        ignores: [
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

            ...userIgnores,
        ],
        name: "anolilab/ignores",
    },
];

export default ignores;
