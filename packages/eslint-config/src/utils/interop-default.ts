import type { Awaitable } from "../types";

const interopDefault = async <T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> => {
    const resolved = await m;

    return ((resolved as unknown as Record<string, unknown>)["default"] ?? resolved) as T extends { default: infer U } ? U : T;
};

export default interopDefault;
