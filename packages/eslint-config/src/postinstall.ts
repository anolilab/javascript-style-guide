import { env, exit } from "node:process";

import { projectPath } from "@anolilab/package-json-utils";

import writeEslintIgnore from "./postinstall/write-eslint-ignore";
import writeEslintRc from "./postinstall/write-eslint-rc";

if (env["CI"]) {
    exit(0);
}

console.log("Configuring @anolilab/eslint-config", projectPath, "\n");

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    try {
        // eslint-disable-next-line compat/compat
        await Promise.all([writeEslintRc(), writeEslintIgnore()]);

        console.log("😎  Everything went well, have fun!");

        exit(0);
    } catch (error) {
        console.log("😬  something went wrong:");
        console.error(error);

        exit(1);
    }
})();
