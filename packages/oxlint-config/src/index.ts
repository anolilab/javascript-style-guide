/**
 * Shared oxlint configuration for Anolilab.
 *
 * The canonical config lives in `.oxlintrc.json` at the package root so it can be consumed two ways:
 * from a consumer `.oxlintrc.json` that `extends` the file by path (oxlint JSON configs cannot
 * import npm packages), or from `oxlint.config.ts` as the imported object re-exported here.
 * @see https://oxc.rs/docs/guide/usage/linter/config
 * @see https://github.com/anolilab/javascript-style-guide/tree/main/packages/oxlint-config#readme
 */

export { default } from "../.oxlintrc.json";
