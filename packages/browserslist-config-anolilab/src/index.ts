const config = {
    legacyBrowsers: ["> 1%", "last 2 versions", "Firefox ESR"] as const,
    modernBrowsers: [
        "last 2 Chrome versions",
        "not Chrome < 60",
        "last 2 Safari versions",
        "not Safari < 10.1",
        "last 2 iOS versions",
        "not iOS < 10.3",
        "last 2 Firefox versions",
        "not Firefox < 54",
        "last 2 Edge versions",
        "not Edge < 15",
    ] as const,

    /** NOTE: Meaning LTS version. Any version above LTS is not considered as "major release", AFAIK. */
    node: ["last 2 node major versions"] as const,
    production: ["> 1%", "last 2 versions", "Firefox ESR", "not dead"] as const,
    ssr: ["node 22"] as const,
};

export default config;
