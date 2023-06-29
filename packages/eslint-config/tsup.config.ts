import { createConfig } from "../../tsup.config";

const config = createConfig({
    format: "cjs",
    splitting: false,
});

export default config;
