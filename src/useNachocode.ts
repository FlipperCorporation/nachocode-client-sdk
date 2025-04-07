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
  options: Nachocode.InitializeOptions = { logger: true },
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

    loadNachocode(apiKey, options, version, onInitialized)
      .then((sdk: typeof Nachocode) => {
        if (!isMounted.current) return;

        setState({
          isLoading: false,
          isError: false,
          error: null,
          Nachocode: sdk,
        });
      })
      .catch((error: Error) => {
        if (!isMounted.current) return;

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
  }, [apiKey, options, version, onInitialized]);

  return state;
}
