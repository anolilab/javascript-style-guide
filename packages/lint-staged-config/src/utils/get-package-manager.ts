import { hasFile } from "@anolilab/package-json-utils";

const getPackageManager = (): "npm" | "pnpm" | "yarn" => {
    if (global.anolilabLintStagedPackageManager) {
        return global.anolilabLintStagedPackageManager;
    }

    if (hasFile("pnpm-lock.yaml")) {
        global.anolilabLintStagedPackageManager = "pnpm";

        return "pnpm";
    }

    if (hasFile("yarn.lock")) {
        global.anolilabLintStagedPackageManager = "yarn";

        return "yarn";
    }

    if (hasFile("package-lock.json")) {
        global.anolilabLintStagedPackageManager = "npm";

        return "npm";
    }

    throw new Error("No package manager found");
};

export default getPackageManager;
