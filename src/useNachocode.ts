import { useEffect, useRef, useState } from 'react';
import { loadNachocode } from './loadNachocode';

type UseNachocodeReturn =
  | { isLoading: true; isError: false; error: null; Nachocode: null }
  | { isLoading: false; isError: true; error: Error; Nachocode: null }
  | {
      isLoading: false;
      isError: false;
      error: null;
      Nachocode: typeof Nachocode;
    };

export function useNachocode(
  apiKey: string,
  options?: Nachocode.InitializeOptions,
  version?: Nachocode.VersionString,
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
  }) => any
): UseNachocodeReturn {
  const isMounted = useRef(false);
  const [state, setState] = useState<UseNachocodeReturn>({
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
      .then((sdk: typeof Nachocode) => {
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
      .catch((error: Error) => {
        if (!isMounted.current) return;

        // SDK 로드 실패
        console.error('[Nachocode] Failed to load Nachocode SDK:', error);
        setState({
          isLoading: false,
          isError: true,
          error,
          Nachocode: null,
        });
      });

    return () => {
      isMounted.current = false;
    };
  }, [apiKey, version]);

  return state;
}
