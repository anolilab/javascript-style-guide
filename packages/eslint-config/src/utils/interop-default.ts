import type { Awaitable } from "../types";

const interopDefault = async <T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> => {
    const resolved = await m;

    // Functions are checked too: plenty of CJS plugins export a callable that also carries `default`.
    // The null check is required, not redundant: `typeof null === "object"`, and TypeScript rejects
    // `"default" in resolved` without it.
    // eslint-disable-next-line sonarjs/different-types-comparison -- see comment above
    const hasDefault = (typeof resolved === "object" || typeof resolved === "function") && resolved !== null && "default" in resolved;
    const value = hasDefault ? (resolved.default ?? resolved) : resolved;

    // The `"default" in resolved` check above is exactly the condition the return type distributes
    // over, but TypeScript cannot match a narrowing against a conditional type whose input is an
    // unresolved generic, so the result has to be asserted.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- see comment above
    return value as T extends { default: infer U } ? U : T;
};

export default interopDefault;
