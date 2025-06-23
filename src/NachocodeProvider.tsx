// Module dependencies
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// Custom module dependencies

import Nachocode from '@nachocode/types';
import { loadNachocode } from './loadNachocode';

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
  const isMounted = useRef(false);
  const [state, setState] = useState<NachocodeContextType>({
    isLoading: true,
    isError: false,
    error: null,
    Nachocode: null,
  });

  useEffect(() => {
    isMounted.current = true;

    if (options?.logger) {
      // NachoProvider 마운트됨
      console.log('[Nachocode] NachoProvider mounted.');
    }

    loadNachocode(apiKey, options, version, onInitialized)
      .then(sdk => {
        if (!isMounted.current) return;

        if (options?.logger) {
          // SDK 로드 완료
          console.log('[Nachocode] Nachocode SDK successfully loaded:', sdk);
        }
        setState({
          isLoading: false,
          isError: false,
          error: null,
          Nachocode: sdk,
        });
      })
      .catch(err => {
        if (!isMounted.current) return;

        // SDK 로드 실패
        console.error('[Nachocode] Failed to load Nachocode SDK:', err);
        setState({
          isLoading: false,
          isError: true,
          error: err,
          Nachocode: null,
        });
      });

    return () => {
      isMounted.current = false;
    };
  }, [apiKey, version]);

  return (
    <NachoContext.Provider value={state}>{children}</NachoContext.Provider>
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
