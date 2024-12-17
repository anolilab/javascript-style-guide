import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineConfig, eslintExtensions } from "../src";

const { parsePackageJsonMock, findPackageManagerSyncMock, existsSyncMock } = vi.hoisted(() => {
    return {
        parsePackageJsonMock: vi.fn(),
        findPackageManagerSyncMock: vi.fn(),
        existsSyncMock: vi.fn(),
    };
});

vi.mock("@visulima/package", async (importOriginal) => {
    const original = await importOriginal();

    return {
        // @ts-ignore
        ...original,
        parsePackageJson: parsePackageJsonMock,
        findPackageManagerSync: findPackageManagerSyncMock,
    };
});

vi.mock("node:fs", async () => {
    return {
        existsSync: existsSyncMock,
    };
});

describe("defineConfig", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should return default lint-staged config when called with no options", () => {
        existsSyncMock.mockReturnValue(true);
        parsePackageJsonMock.mockReturnValue({ dependencies: { eslint: "1.0.0" } });
        findPackageManagerSyncMock.mockReturnValue({ packageManager: "npm" });

        expect(defineConfig()).toEqual({
            [`**/*.{${eslintExtensions.join(",")}}`]: expect.any(Function),
        });
    });

    it("should throw error when package.json not found in directory", () => {
        existsSyncMock.mockReturnValue(false);

        const testCwd = "/test/dir";

        expect(() => {
            defineConfig({ cwd: testCwd });
        }).toThrow(`No package.json found in the current working directory: ${testCwd}; Please adjust the "cwd" option.`);
    });

    it("should throw error when eslint extensions array is empty", () => {
        existsSyncMock.mockReturnValue(true);
        parsePackageJsonMock.mockReturnValue({ dependencies: { eslint: "1.0.0" } });
        findPackageManagerSyncMock.mockReturnValue({ packageManager: "npm" });

        expect(() => {
            defineConfig({
                eslint: {
                    extensions: [],
                },
            });
        }).toThrow("The `extensions` option is required for the ESLint configuration.");
    });
});
