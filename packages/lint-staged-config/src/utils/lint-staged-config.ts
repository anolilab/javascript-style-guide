import { pkg } from "@anolilab/package-json-utils";

if (!global.anolilabLintStagedPackageJsonConfig && pkg) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    global.anolilabLintStagedPackageJsonConfig = pkg["anolilab"]?.["lint-staged-config"];
}

const config: { [key: string]: boolean | undefined } = global.anolilabLintStagedPackageJsonConfig ?? {};

export default config;
