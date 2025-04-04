import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

declare function loadNachocode(apiKey: string, options?: Nachocode.InitializeOptions, version?: Nachocode.VersionString, onInitialized?: (response?: {
    appKey?: string;
    appName?: string;
    appSourceVersion?: Nachocode.VersionString;
    appVersion?: Nachocode.VersionString;
    deviceModel?: string;
    os?: 'iOS' | 'Android';
    osVersion?: string;
    packageName?: string;
    pushToken?: string;
}) => any): Promise<typeof Nachocode>;

interface NachoContextType {
    Nachocode: typeof window.Nachocode | null;
    loading: boolean;
    error: Error | null;
}
declare function NachoProvider({ apiKey, options, version, onInitialized, children, }: {
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
    }) => void;
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useNachocode(): NachoContextType;

export { NachoProvider, loadNachocode, useNachocode };
