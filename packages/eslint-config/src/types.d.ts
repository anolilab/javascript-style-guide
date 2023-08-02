export type PackageRules = {
    configName: string;
    dependencies: string[];
    oneOfDependency?: string[];
    resolve?: string[];
    files?: string[];
}[];
