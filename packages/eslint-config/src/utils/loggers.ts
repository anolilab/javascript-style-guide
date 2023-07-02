const noop = () => undefined;

const consolePrefix = (prefix: string) => (process.env["NO_LOGS"] ? noop : (message: string) => console.log(`${prefix}${message}`));

export const consolePlugin = consolePrefix("  eslint-plugin-");
export const consoleLog = consolePrefix("");
