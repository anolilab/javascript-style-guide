import { dirname, join } from "node:path";
import {
 assert, expect, test, vi,
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
    pkg as package_,
    showMissingPackages,
    unique,
} from "../src";

test("hasPackageProperties: returns true when packageJson has the specified property", () => {
    assert.isTrue(hasPackageProperties(["name"]));
});

test("hasPackageProperties: returns false when packageJson does not have the specified property", () => {
    assert.isFalse(hasPackageProperties(["description1"]));
});

test("hasPackageSubProperties: returns true when packageJson has the specified subproperty", () => {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    assert.isTrue(hasPackageSubProperties("dependencies")(["vitest"]));
});

test("hasPackageSubProperties: returns false when packageJson does not have the specified subproperty", () => {
    assert.isFalse(hasPackageSubProperties("devDependencies")(["vitest"]));
});

test("environmentIsSet: returns true when the environment variable is set", () => {
    process.env["TEST_VAR"] = "test";
    assert.isTrue(environmentIsSet("TEST_VAR"));
});

test("environmentIsSet: returns false when the environment variable is not set", () => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete process.env["TEST_VAR"];

    assert.isFalse(environmentIsSet("TEST_VAR"));
});

test("parseEnvironment: returns the parsed value of the environment variable", () => {
    process.env["TEST_VAR"] = JSON.stringify({ value: "test" });

    // eslint-disable-next-line unicorn/no-useless-undefined
    assert.deepEqual(parseEnvironment("TEST_VAR", undefined), { value: "test" });
});

test("parseEnvironment: returns the default value when the environment variable is not set", () => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete process.env["TEST_VAR"];

    assert.deepEqual(parseEnvironment("TEST_VAR", { value: "default" }), { value: "default" });
});

test("fromRoot: joins the provided path segments with the app directory", () => {
    // eslint-disable-next-line unicorn/prefer-module
    assert.equal(fromRoot(), join(dirname(__dirname), "../.."));
});

test("hasFile: returns true when the file exists", () => {
    assert.isTrue(hasFile("package.json"));
});

test("hasFile: returns false when the file does not exist", () => {
    assert.isFalse(hasFile("nonexistent-file.js"));
});

test("hasScripts: returns true when the packageJson has the 'scripts' property", () => {
    assert.isTrue(hasScripts(["test"]));
});

test("hasScripts: returns false when the packageJson does not have the 'scripts' property", () => {
    assert.isFalse(hasScripts(["tes"]));
});

test("hasPeerDep: returns false when the packageJson does not have the 'peerDependencies' property", () => {
    assert.isFalse(hasPeerDep(["react"]));
});

test("hasDep: returns true when the packageJson has the 'dependencies' property", () => {
    assert.isTrue(hasDep(["vitest"]));
});

test("hasDep: returns false when the packageJson does not have the 'dependencies' property", () => {
    assert.isFalse(hasDep(["dsa"]));
});

test("hasDevelopmentDep: returns false when the packageJson does not have the 'devDependencies' property", () => {
    assert.isFalse(hasDevelopmentDep(["cross-env2"]));
});

test("hasAnyDep: returns true when any of the dependency checks return true", () => {
    assert.isTrue(hasAnyDep(["vitest"]));
});

test("hasAnyDep: returns false when all of the dependency checks return false", () => {
    assert.isFalse(hasAnyDep(["read-pkg-u2p"]));
});

test("hasTypescript: returns true when 'typescript' is a dependency and 'tsconfig.json' exists", () => {
    assert.isTrue(hasTypescript);
});

test("packageIsTypeModule: returns false when the packageJson does not have the 'type' property", () => {
    assert.isFalse(packageIsTypeModule);
});

test("isPackageAvailable: returns true when the package is available", () => {
    assert.isTrue(isPackageAvailable("vitest"));
});

test("isPackageAvailable: returns false when the package is not available", () => {
    assert.isFalse(isPackageAvailable("vitest2"));
});

test.each(["warn", "log", "error", "info"])("showMissingPackages: logs a %type message with the missing packages", (type: "error" | "info" | "log" | "warn") => {
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

test("showMissingPackages: logs a warning message with the missing packages, pre and post message", () => {
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

test("unique: returns an array with unique values", () => {
    const array = [1, 2, 2, 3, 3, 3];

    assert.deepEqual(unique(array), [1, 2, 3]);
});

test("pkg: returns packageJson as NormalizedReadResult or undefined", () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    assert.isTrue(typeof package_ === "object" || package_ === undefined);
});
