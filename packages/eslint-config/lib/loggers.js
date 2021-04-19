// eslint-disable-next-line unicorn/no-useless-undefined
const noop = () => undefined;

const consolePrefix = (prefix) =>
    // eslint-disable-next-line no-console
    Boolean(process.env.NO_LOGS) ? noop : (file) => console.log(`${prefix}${file}`);

export const consolePlugin = consolePrefix('  eslint-plugin-');
export const consoleConfig = consolePrefix('  eslint-config-');
export const consoleLog = consolePrefix('');
