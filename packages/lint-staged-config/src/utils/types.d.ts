import type { Join } from "type-fest";

export type AbsolutePath = `/${string}`;
export type ConfigFileName = string;
export type ConfigPath<A extends AbsolutePath, N extends ConfigFileName> = Join<[A, N], "/">;
