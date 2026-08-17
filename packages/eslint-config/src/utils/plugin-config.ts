import type { Rules, TypedFlatConfigItem } from "../types";

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

    if (typeof source === "object" && source !== null && "rules" in source) {
        Object.assign(rules, source.rules);
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

    if (typeof source === "object" && source !== null && "plugins" in source) {
        Object.assign(plugins, source.plugins);
    }

    return plugins;
};

/**
 * Reads a whole flat config item out of an ESLint plugin's shared config.
 * @param source A shared config object.
 * @returns A copy of it as a flat config item, or an empty item when it is not an object.
 */
export const configItem = (source: unknown): TypedFlatConfigItem => {
    const item: TypedFlatConfigItem = {};

    if (typeof source === "object" && source !== null) {
        Object.assign(item, source);
    }

    return item;
};
