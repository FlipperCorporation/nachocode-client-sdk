export declare function loadNachocode(apiKey: string, options?: Nachocode.InitializeOptions, version?: Nachocode.VersionString, onInitialized?: (response?: {
    appKey?: string;
    appName?: string;
    appSourceVersion?: Nachocode.VersionString;
    appVersion?: Nachocode.VersionString;
    deviceModel?: string;
    os?: 'iOS' | 'Android';
    osVersion?: string;
    packageName?: string;
    pushToken?: string;
}) => void): Promise<typeof window.Nachocode>;
