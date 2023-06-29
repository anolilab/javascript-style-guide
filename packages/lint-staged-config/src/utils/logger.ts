import { env } from "node:process";

const noop = () => undefined;

const consolePrefix = (prefix: string) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    (env["NO_LOGS"] ? noop : (message: string) => console.log(`${prefix}${message}`));

const consoleLog = consolePrefix("");

export default consoleLog;
