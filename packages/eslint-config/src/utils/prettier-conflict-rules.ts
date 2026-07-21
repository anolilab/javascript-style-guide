import type { TypedFlatConfigItem } from "../types";
import interopDefault from "./interop-default";

const cache: { rules?: NonNullable<TypedFlatConfigItem["rules"]> } = {};

/**
 * Loads eslint-config-prettier's canonical list of the rules that conflict with Prettier (and the
 * Prettier-compatible oxfmt), so config blocks can defer to it instead of hand-maintaining their
 * own off-lists. Loaded once and reused; spread the result into a config's `rules` when a JS/TS
 * formatter owns styling.
 */
const getPrettierConflictRules = async (): Promise<NonNullable<TypedFlatConfigItem["rules"]>> => {
    if (cache.rules === undefined) {
        const configPrettier = await interopDefault(import("eslint-config-prettier"));

        cache.rules = configPrettier.rules as NonNullable<TypedFlatConfigItem["rules"]>;
    }

    return cache.rules;
};

export default getPrettierConflictRules;
