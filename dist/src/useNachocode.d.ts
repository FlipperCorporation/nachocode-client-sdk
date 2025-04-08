import type Nachocode from '../types/Nachocode.d.ts';
type UseNachocodeReturn = {
    isLoading: true;
    isError: false;
    error: null;
    Nachocode: null;
} | {
    isLoading: false;
    isError: true;
    error: Error;
    Nachocode: null;
} | {
    isLoading: false;
    isError: false;
    error: null;
    Nachocode: typeof Nachocode;
};
export declare function useNachocode(apiKey: string, options?: Nachocode.InitializeOptions, version?: Nachocode.VersionString, onInitialized?: (response?: {
    appKey?: string;
    appName?: string;
    appSourceVersion?: Nachocode.VersionString;
    appVersion?: Nachocode.VersionString;
    deviceModel?: string;
    os?: 'iOS' | 'Android';
    osVersion?: string;
    packageName?: string;
    pushToken?: string;
}) => void): UseNachocodeReturn;
export {};
