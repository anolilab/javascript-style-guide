import type { Awaitable, TypedFlatConfigItem } from "../types";

/**
 * Combine array and non-array configs into a single array.
 * @param {TypedFlatConfigItem | TypedFlatConfigItem[]} configs
 * @returns {Promise<TypedFlatConfigItem[]>}
 */
const combine = async (
    ...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): Promise<TypedFlatConfigItem[]> => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const resolved = await Promise.all(configs);

    return resolved.flat();
};

export default combine;
