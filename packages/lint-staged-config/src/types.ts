import type { Join } from "type-fest";

export type EslintConfig = {
    extensions?: string[];
    cache?: boolean;
    config?: string;
    "fix-type"?: string[];
    "max-warnings"?: number | string | false;
    rules?: string[];
}

export type AbsolutePath = `/${string}`;
export type ConfigFileName = string;
export type ConfigPath<A extends AbsolutePath, N extends ConfigFileName> = Join<[A, N], "/">;
