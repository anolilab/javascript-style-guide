// eslint-disable-next-line unicorn/no-useless-undefined
const noop = () => undefined;

const consolePrefix = (prefix) =>
    // eslint-disable-next-line no-console,implicit-arrow-linebreak,no-undef
    (process.env.NO_LOGS ? noop : (file) => console.log(`${prefix}${file}`));

module.exports = {
    consolePlugin: consolePrefix("  eslint-plugin-"),
    consoleConfig: consolePrefix("  eslint-config-"),
    consoleLog: consolePrefix(""),
};
