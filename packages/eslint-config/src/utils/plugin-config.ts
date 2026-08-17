import type { Rules, TypedFlatConfigItem } from "../types";

/**
 * An object read from outside the type system — an untyped plugin, or a config object handed in by
 * a JavaScript consumer. The keys genuinely are not known ahead of time, so every value reads back
 * as `unknown` and has to be narrowed before use.
 */
export interface UnknownRecord {
    readonly [key: string]: unknown;
}

/**
 * Checks that a value can be copied key by key.
 *
 * Arrays and strings are excluded deliberately: `Object.assign` would happily copy their indices
 * and produce a record keyed `0`, `1`, `2`, which downstream reads as a nonsense ESLint config
 * rather than as the absent value it actually is.
 * @param value Any value.
 * @returns True when the value is a non-null, non-array object.
 */
export const isRecord = (value: unknown): value is UnknownRecord => typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Reads the `rules` record out of an ESLint plugin or one of its shared configs.
 *
 * Plugin objects are untyped or loosely typed across the ecosystem. Checking the shape here and
 * copying the result into a fresh object keeps that one boundary in a single place, instead of
 * every call site asserting a shape the plugin never promised.
 * @param source A plugin or shared config that may expose a `rules` record.
 * @returns The rules it exposes, or an empty object when it exposes none.
 */
export const configRules = (source: unknown): Rules => {
    const rules: Rules = {};

    if (isRecord(source) && isRecord(source["rules"])) {
        Object.assign(rules, source["rules"]);
    }

    return rules;
};

/**
 * Reads the `plugins` record out of an ESLint shared config.
 * @param source A shared config that may expose a `plugins` record.
 * @returns The plugins it exposes, or an empty object when it exposes none.
 */
export const configPlugins = (source: unknown): NonNullable<TypedFlatConfigItem["plugins"]> => {
    const plugins: NonNullable<TypedFlatConfigItem["plugins"]> = {};

    if (isRecord(source) && isRecord(source["plugins"])) {
        Object.assign(plugins, source["plugins"]);
    }

    return plugins;
};

/**
 * Reads a whole flat config item out of an ESLint plugin's shared config.
 * @param source A shared config object.
 * @returns A copy of it as a flat config item, or an empty item when it is not a record.
 */
export const configItem = (source: unknown): TypedFlatConfigItem => {
    const item: TypedFlatConfigItem = {};

    if (isRecord(source)) {
        Object.assign(item, source);
    }

    return item;
};
