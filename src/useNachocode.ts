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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
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
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, options, version, onInitialized]);

  return { Nachocode: nachocode, loading, error };
}
