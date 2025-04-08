import { ReactNode } from 'react';
import type Nachocode from '../types/Nachocode.d.ts';
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
    }) => void;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useNachocodeContext(): NachocodeContextType;
export {};
