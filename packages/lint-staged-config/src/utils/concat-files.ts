import { quote } from "shell-quote";

import isWindows from "./is-windows";

/**
 * Concatenate and escape a list of filenames that can be passed as args to prettier cli
 *
 * Prettier and Stylelint have an issue with special characters in filenames,
 * such as the ones uses for Next.js dynamic routes (ie: [id].tsx...)
 *
 * @link https://github.com/okonet/lint-staged/issues/676
 *
 * @param {string[]} filenames
 * @returns {string} Return concatenated and escaped filenames
 */
const concatFiles = (filenames: string[]): string => filenames.map((filename) => `"${isWindows ? filename : quote([filename])}"`).join(" ");

export default concatFiles;
