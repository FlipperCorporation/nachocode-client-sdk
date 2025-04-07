import { useEffect, useState } from 'react';
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
  const [nachocode, setNachocode] = useState<typeof Nachocode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    loadNachocode(apiKey, options, version, onInitialized)
      .then((sdk: typeof Nachocode) => {
        if (isMounted) {
          setNachocode(sdk);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, options, version, onInitialized]);

  return { Nachocode: nachocode, isLoading, error };
}
