import { env } from "node:process";

// eslint-disable-next-line regexp/no-unused-capturing-group
const isWindows = process && (process.platform === "win32" || /^(msys|cygwin)$/.test(env["OSTYPE"] ?? ""));

export default isWindows;
