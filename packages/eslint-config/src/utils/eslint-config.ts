import { pkg } from "@anolilab/package-json-utils";

if (!global.anolilabEslintPackageJsonConfig && pkg) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    global.anolilabEslintPackageJsonConfig = pkg?.["anolilab"]?.["eslint-config"];
}

const config: { [key: string]: boolean | undefined } = global.anolilabEslintPackageJsonConfig ?? {};

export default config;
