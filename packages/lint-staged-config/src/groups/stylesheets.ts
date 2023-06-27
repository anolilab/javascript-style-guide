import type { Config } from "lint-staged";

const group: Config = {
    [`*.{${["css", "sass", "scss", "less"].join(",")}}`]: ["stylelint"],
};

export default group;
