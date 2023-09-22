import { env, platform } from "node:process";

// eslint-disable-next-line regexp/no-unused-capturing-group
const isWindows = platform === "win32" || /^(msys|cygwin)$/u.test(env["OSTYPE"] ?? "");

export default isWindows;
