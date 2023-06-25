import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";

let hasPrettyQuick = false;

if (hasDependency("pretty-quick") || hasDevDependency("pretty-quick")) {
    hasPrettyQuick = true;
}

const group = {
    "*": hasPrettyQuick ? ["pretty-quick --check --staged"] : ["prettier --list-different"],
};

export default group;
