import { dirname } from "node:path";
import {
 describe, expect, it, vi,
} from "vitest";

import {
    environmentIsSet,
    fromRoot,
    hasAnyDep,
    hasDep,
    hasDevelopmentDep,
    hasFile,
    hasPackageProperties,
    hasPackageSubProperties,
    hasPeerDep,
    hasScripts,
    hasTypescript,
    isPackageAvailable,
    packageIsTypeModule,
    parseEnvironment,
    showMissingPackages,
    unique,
} from "../src";

describe("package-json-utils", () => {
    it("hasPackageProperties: returns true when packageJson has the specified property", () => {
        expect(hasPackageProperties(["name"])).toBeTruthy();
    });

    it("hasPackageProperties: returns false when packageJson does not have the specified property", () => {
        expect(hasPackageProperties(["description1"])).toBeFalsy();
    });

    it("hasPackageSubProperties: returns true when packageJson has the specified subproperty", () => {
        expect(hasPackageSubProperties("dependencies")(["dot-path-value"])).toBeTruthy();
    });

    it("hasPackageSubProperties: returns false when packageJson does not have the specified subproperty", () => {
        expect(hasPackageSubProperties("devDependencies")(["vitest1"])).toBeFalsy();
    });

    it("environmentIsSet: returns true when the environment variable is set", () => {
        process.env["TEST_VAR"] = "test";
        expect(environmentIsSet("TEST_VAR")).toBeTruthy();
    });

    it("environmentIsSet: returns false when the environment variable is not set", () => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete process.env["TEST_VAR"];

        expect(environmentIsSet("TEST_VAR")).toBeFalsy();
    });

    it("parseEnvironment: returns the parsed value of the environment variable", () => {
        process.env["TEST_VAR"] = JSON.stringify({ value: "test" });

        expect(parseEnvironment("TEST_VAR", undefined)).toStrictEqual({ value: "test" });
    });

    it("parseEnvironment: returns the default value when the environment variable is not set", () => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete process.env["TEST_VAR"];

        expect(parseEnvironment("TEST_VAR", { value: "default" })).toStrictEqual({ value: "default" });
    });

    it("fromRoot: joins the provided path segments with the app directory", () => {
        expect(fromRoot()).toStrictEqual(dirname(__dirname));
    });

    it("hasFile: returns true when the file exists", () => {
        expect(hasFile("package.json")).toBeTruthy();
    });

    it("hasFile: returns false when the file does not exist", () => {
        expect(hasFile("nonexistent-file.js")).toBeFalsy();
    });

    it("hasScripts: returns true when the packageJson has the 'scripts' property", () => {
        expect(hasScripts(["test"])).toBeTruthy();
    });

    it("hasScripts: returns false when the packageJson does not have the 'scripts' property", () => {
        expect(hasScripts(["tes"])).toBeFalsy();
    });

    it("hasPeerDep: returns false when the packageJson does not have the 'peerDependencies' property", () => {
        expect(hasPeerDep(["react"])).toBeFalsy();
    });

    it("hasDep: returns true when the packageJson has the 'dependencies' property", () => {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        expect(hasDep(["read-pkg-up"])).toBeTruthy();
    });

    it("hasDep: returns false when the packageJson does not have the 'dependencies' property", () => {
        expect(hasDep(["dsa"])).toBeFalsy();
    });

    it("hasDevelopmentDep: returns false when the packageJson does not have the 'devDependencies' property", () => {
        expect(hasDevelopmentDep(["cross-env2"])).toBeFalsy();
    });

    it("hasAnyDep: returns true when any of the dependency checks return true", () => {
        expect(hasAnyDep(["read-pkg-up"])).toBeTruthy();
    });

    it("hasAnyDep: returns false when all of the dependency checks return false", () => {
        expect(hasAnyDep(["read-pkg-u2p"])).toBeFalsy();
    });

    it("hasTypescript: returns true when 'typescript' is a dependency and 'tsconfig.json' exists", () => {
        expect(hasTypescript).toBeTruthy();
    });

    it("packageIsTypeModule: returns false when the packageJson does not have the 'type' property", () => {
        expect(packageIsTypeModule).toBeFalsy();
    });

    it("isPackageAvailable: returns true when the package is available", () => {
        expect(isPackageAvailable("read-pkg-up")).toBeTruthy();
    });

    it("isPackageAvailable: returns false when the package is not available", () => {
        expect(isPackageAvailable("vitest2")).toBeFalsy();
    });

    it.each<"error" | "info" | "log" | "warn">(["warn", "log", "error", "info"])("showMissingPackages: logs a %type message with the missing packages", (type) => {
        const consoleMock = vi.spyOn(console, type);

        showMissingPackages("example", ["package1", "package2"], {
            consoleType: type,
        });

        expect(consoleMock).toHaveBeenCalledTimes(1);
        expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining("example could not find the following packages"));
        expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining("package1"));
        expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining("package2"));

        consoleMock.mockRestore();
    });

    it("showMissingPackages: logs a warning message with the missing packages, pre and post message", () => {
        const consoleMock = vi.spyOn(console, "warn");

        showMissingPackages("example", ["package1", "package2"], {
            preMessage: "pre message",
            postMessage: "post message",
        });

        expect(consoleMock).toHaveBeenCalledTimes(1);
        expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining("pre message"));
        expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining("example could not find the following packages"));
        expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining("package1"));
        expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining("package2"));
        expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining("post message"));

        consoleMock.mockRestore();
    });

    it("unique: returns an array with unique values", () => {
        const array = [1, 2, 2, 3, 3, 3];

        expect(unique(array)).toStrictEqual([1, 2, 3]);
    });
});
