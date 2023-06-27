import type { Config } from "lint-staged";

const group: Config = {
    "**/__tests__/**/*.?(c|m)[jt]s?(x)": ["vitest related --run"],
    "**/?(*.){test,spec}.?(c|m)[jt]s?(x)": ["vitest related --run"],
};

export default group;
