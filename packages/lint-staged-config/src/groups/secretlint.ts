import type { Config } from "lint-staged";

const group: Config = {
    "*": ["secretlint"],
};

export default group;
