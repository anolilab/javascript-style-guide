import { beforeEach, describe, expect, it, vi } from "vitest";

import { defineConfig, eslintExtensions } from "../src";

const { existsSyncMock, findPackageManagerSyncMock, parsePackageJsonMock } =
    vi.hoisted(() => {
        return {
            // eslint-disable-next-line vitest/require-mock-type-parameters
            existsSyncMock: vi.fn(),
            // eslint-disable-next-line vitest/require-mock-type-parameters
            findPackageManagerSyncMock: vi.fn(),
            // eslint-disable-next-line vitest/require-mock-type-parameters
            parsePackageJsonMock: vi.fn(),
        };
    });

vi.mock("@visulima/package", async (importOriginal) => {
    const original = await importOriginal();

    return {
        // @ts-expect-error - mock
        ...original,
        findPackageManagerSync: findPackageManagerSyncMock,
        parsePackageJson: parsePackageJsonMock,
    };
});

vi.mock("node:fs", async () => {
    return {
        existsSync: existsSyncMock,
    };
});

describe(defineConfig, () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should return default lint-staged config when called with no options", () => {
        expect.assertions(1);

        existsSyncMock.mockReturnValue(true);
        parsePackageJsonMock.mockReturnValue({
            dependencies: { eslint: "1.0.0" },
        });
        findPackageManagerSyncMock.mockReturnValue({ packageManager: "npm" });

        expect(defineConfig()).toStrictEqual({
            [`**/*.{${eslintExtensions.join(",")}}`]: expect.any(Function),
        });
    });

    it("should throw error when package.json not found in directory", () => {
        expect.assertions(1);

        existsSyncMock.mockReturnValue(false);

        const testCwd = "/test/dir";

        expect(() => {
            defineConfig({ cwd: testCwd });
        }).toThrow(
            `No package.json found in the current working directory: ${testCwd}; Please adjust the "cwd" option.`,
        );
    });

    it("should throw error when eslint extensions array is empty", () => {
        expect.assertions(1);

        existsSyncMock.mockReturnValue(true);
        parsePackageJsonMock.mockReturnValue({
            dependencies: { eslint: "1.0.0" },
        });
        findPackageManagerSyncMock.mockReturnValue({ packageManager: "npm" });

        expect(() => {
            defineConfig({
                eslint: {
                    extensions: [],
                },
            });
        }).toThrow(
            "The `extensions` option is required for the ESLint configuration.",
        );
    });
});
