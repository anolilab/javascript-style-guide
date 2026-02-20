import type { Join } from "type-fest";

export type AbsolutePath = `/${string}`;

export type ConfigPath<A extends AbsolutePath, N extends string> = Join<[A, N], "/">;
export interface EslintConfig {
    cache?: boolean;
    config?: string;
    extensions?: string[];
    "fix-type"?: string[];
    "max-warnings"?: number | string | false;
    rules?: string[];
}
