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
}) => void): Promise<typeof Nachocode>;

type NachocodeContextType = {
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
declare function useNachocodeContext(): NachocodeContextType;

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
declare function useNachocode(apiKey: string, options?: Nachocode.InitializeOptions, version?: Nachocode.VersionString, onInitialized?: (response?: {
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

export { NachoProvider, loadNachocode, useNachocode, useNachocodeContext };
