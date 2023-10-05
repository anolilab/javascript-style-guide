import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import concatFiles from "../utils/concat-files";
import getPackageManager from "../utils/get-package-manager";

const hasVitest = hasDependency("vitest") || hasDevDependency("vitest");
const hasJest = hasDependency("jest") || hasDevDependency("jest");
const hasAva = hasDependency("ava") || hasDevDependency("ava");

const group: Config = {
    ...(hasVitest && {
        "**/?(*.){test,spec}.?(c|m)[jt]s?(x)": ["vitest related --run"],
        "**/__tests__/**/*.?(c|m)[jt]s?(x)": [`${getPackageManager()} exec vitest related --run`],
    }),
    ...(hasJest && {
        "**/*.spec.{js,ts,tsx}": [`${getPackageManager()} exec jest --findRelatedTests`],
        "**/*.test.{js,ts,tsx}": [`${getPackageManager()} exec jest --findRelatedTests`],
        "**/?(*.){test,spec}.?(c|m)[jt]s?(x)": [`${getPackageManager()} exec jest --findRelatedTests`],
        "**/__mocks__/*.{js,ts,tsx}": [`${getPackageManager()} exec jest --findRelatedTests`],
        "**/__tests__/**/*.?(c|m)[jt]s?(x)": [`${getPackageManager()} exec jest --findRelatedTests`],
        "**/__tests__/*.{js,ts,tsx}": [`${getPackageManager()} exec jest --findRelatedTests`],
        "**/test/*.{js,ts,tsx}": [`${getPackageManager()} exec jest --findRelatedTests`],
    }),
    ...(hasAva && {
        "**/(test|tests|__tests__)/**/*.js": (filenames: string[]) => [`${getPackageManager()} exec ava ${concatFiles(filenames)}`],
        "**/*.(spec|test).js": (filenames: string[]) => [`${getPackageManager()} exec ava ${concatFiles(filenames)}`],
        "**/test.js": (filenames: string[]) => [`${getPackageManager()} exec ava ${concatFiles(filenames)}`],
        "**/test-*.js": (filenames: string[]) => [`${getPackageManager()} exec ava ${concatFiles(filenames)}`],
    }),
};

export default group;
