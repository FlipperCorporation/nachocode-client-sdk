import { useEffect, useRef, useState } from 'react';
import { loadNachocode } from './loadNachocode';

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
) {
  const isMounted = useRef(true);
  const [nachocode, setNachocode] = useState<typeof Nachocode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);

    loadNachocode(apiKey, options, version, onInitialized)
      .then((sdk: typeof Nachocode) => {
        if (isMounted.current) {
          setNachocode(sdk);
        }
      })
      .catch((err: Error) => {
        if (isMounted.current) {
          setIsError(true);
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted.current = false;
    };
  }, [apiKey, options, version, onInitialized]);

  return { Nachocode: nachocode, isLoading, isError, error };
}
