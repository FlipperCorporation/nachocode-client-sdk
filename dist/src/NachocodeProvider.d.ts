import { ReactNode } from 'react';
interface NachoContextType {
    Nachocode: typeof window.Nachocode | null;
    loading: boolean;
    error: Error | null;
}
export declare function NachoProvider({ apiKey, options, version, onInitialized, children, }: {
    apiKey: string;
    options?: Nachocode.InitializeOptions;
    version?: Nachocode.VersionString;
    onInitialized?: (response?: {
        appKey?: string;
        appName?: string;
        appSourceVersion?: Nachocode.VersionString;
        appVersion?: Nachocode.VersionString;
        deviceModel?: string;
        os?: 'iOS' | 'Android';
        osVersion?: string;
        packageName?: string;
        pushToken?: string;
    }) => any;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useNachocode(): NachoContextType;
export {};
