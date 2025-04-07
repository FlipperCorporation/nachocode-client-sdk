import { createContext, ReactNode, useContext } from 'react';
import { useNachocode as useNachocodeHook } from './useNachocode';

type NachocodeContextType =
  | { isLoading: true; isError: false; error: null; Nachocode: null }
  | { isLoading: false; isError: true; error: Error; Nachocode: null }
  | {
      isLoading: false;
      isError: false;
      error: null;
      Nachocode: typeof Nachocode;
    };

const initialContextValue: NachocodeContextType = {
  isLoading: true,
  isError: false,
  error: null,
  Nachocode: null,
};

const NachoContext = createContext<NachocodeContextType>(initialContextValue);

export function NachoProvider({
  apiKey,
  options,
  version,
  onInitialized,
  children,
}: {
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
}) {
  const nachocodeState = useNachocodeHook(
    apiKey,
    options,
    version,
    onInitialized
  );

  const contextValue: NachocodeContextType = {
    Nachocode: nachocodeState.Nachocode,
    isLoading: nachocodeState.isLoading,
    isError: nachocodeState.isError,
    error: nachocodeState.error,
  } as NachocodeContextType;

  return (
    <NachoContext.Provider value={contextValue}>
      {children}
    </NachoContext.Provider>
  );
}

export function useNachocodeContext() {
  const context = useContext(NachoContext);
  if (!context) {
    throw new Error(
      '[Nachocode] `useNachocodeContext` must be used within a `<NachoProvider>` component.'
    );
  }
  return context;
}
