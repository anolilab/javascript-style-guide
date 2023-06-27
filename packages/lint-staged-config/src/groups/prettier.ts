import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

let hasPrettyQuick = false;

if (hasDependency("pretty-quick") || hasDevDependency("pretty-quick")) {
    hasPrettyQuick = true;
}

const group: Config = {
    "!(CHANGELOG|LICENSE)*": hasPrettyQuick ? ["pretty-quick --check --staged"] : ["prettier --list-different"],
};

export default group;
