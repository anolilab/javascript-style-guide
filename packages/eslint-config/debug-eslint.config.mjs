import { createConfig } from "./dist/index.mjs";

export default createConfig({
    typescript: {
        tsconfigPath: "./tsconfig.json",
        isTypeAware: true,
    },
});
