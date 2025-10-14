import { env, platform } from "node:process";

const isWindows: boolean =
    // eslint-disable-next-line regexp/no-unused-capturing-group
    platform === "win32" || /^(msys|cygwin)$/u.test(env["OSTYPE"] ?? "");

export default isWindows;
