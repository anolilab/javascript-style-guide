import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import concatFiles from "../utils/concat-files";

const hasVitest = hasDependency("vitest") || hasDevDependency("vitest");
const hasJest = hasDependency("jest") || hasDevDependency("jest");
const hasAva = hasDependency("ava") || hasDevDependency("ava");

const group: Config = {
    ...(hasVitest && { "**/?(*.){test,spec}.?(c|m)[jt]s?(x)": ["vitest related --run"], "**/__tests__/**/*.?(c|m)[jt]s?(x)": ["vitest related --run"] }),
    ...(hasJest && {
        "**/*.spec.{js,ts,tsx}": ["jest --findRelatedTests"],
        "**/*.test.{js,ts,tsx}": ["jest --findRelatedTests"],
        "**/?(*.){test,spec}.?(c|m)[jt]s?(x)": ["jest --findRelatedTests"],
        "**/__mocks__/*.{js,ts,tsx}": ["jest --findRelatedTests"],
        "**/__tests__/**/*.?(c|m)[jt]s?(x)": ["jest --findRelatedTests"],
        "**/__tests__/*.{js,ts,tsx}": ["jest --findRelatedTests"],
        "**/test/*.{js,ts,tsx}": ["jest --findRelatedTests"],
    }),
    ...(hasAva && {
        "**/(test|tests|__tests__)/**/*.js": (filenames: string[]) => [`ava ${concatFiles(filenames)}`],
        "**/*.(spec|test).js": (filenames: string[]) => [`ava ${concatFiles(filenames)}`],
        "**/test.js": (filenames: string[]) => [`ava ${concatFiles(filenames)}`],
        "**/test-*.js": (filenames: string[]) => [`ava ${concatFiles(filenames)}`],
    }),
};

export default group;
