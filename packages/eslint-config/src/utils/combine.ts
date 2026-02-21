import type { Awaitable, TypedFlatConfigItem } from "../types";

/**
 * Combine array and non-array configs into a single array.
 * @param configs
 */
const combine = async (...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]): Promise<TypedFlatConfigItem[]> => {
    const resolved = await Promise.all(configs);

    return resolved.flat();
};

export default combine;
