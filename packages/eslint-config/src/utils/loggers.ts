// eslint-disable-next-line unicorn/no-useless-undefined
const noop = () => undefined;

const consolePrefix = (prefix: string) =>
    // eslint-disable-next-line no-console,implicit-arrow-linebreak,no-undef
    (process.env["NO_LOGS"] ? noop : (message: string) => console.log(`${prefix}${message}`));

export const consolePlugin = consolePrefix("  eslint-plugin-");
export const consoleLog = consolePrefix("");
