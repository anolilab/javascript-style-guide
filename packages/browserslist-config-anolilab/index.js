export default {
    "production": [
        "> 1%",
        "last 2 versions",
        "Firefox ESR",
        "not dead"
    ],
    "legacyBrowsers": [
        "> 1%",
        "last 2 versions",
        "Firefox ESR"
    ],
    "modernBrowsers": [
        "last 2 Chrome versions",
        "not Chrome < 60",
        "last 2 Safari versions",
        "not Safari < 10.1",
        "last 2 iOS versions",
        "not iOS < 10.3",
        "last 2 Firefox versions",
        "not Firefox < 54",
        "last 2 Edge versions",
        "not Edge < 15"
    ],
    "ssr": [
        "node 12"
    ]
};
