import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { loadNachocode } from './loadNachocode';

interface NachoContextType {
  Nachocode: typeof window.Nachocode | null;
  loading: boolean;
  error: Error | null;
}

const NachoContext = createContext<NachoContextType | undefined>(undefined);

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
  const [nachocode, setNachocode] = useState<typeof window.Nachocode | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options?.logger) {
      // NachoProvider 마운트됨
      console.log('[Nachocode] NachoProvider mounted.');
    }

    loadNachocode(apiKey, options, version, onInitialized)
      .then(sdk => {
        if (options?.logger) {
          // SDK 로드 완료
          console.log('[Nachocode] Nachocode SDK successfully loaded:', sdk);
        }
        setNachocode(sdk);
      })
      .catch(err => {
        // SDK 로드 실패
        console.error('[Nachocode] Failed to load Nachocode SDK:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [apiKey, options, version, onInitialized]);

  return (
    <NachoContext.Provider value={{ Nachocode: nachocode, loading, error }}>
      {children}
    </NachoContext.Provider>
  );
}

export function useNachocode() {
  const context = useContext(NachoContext);
  if (!context) {
    throw new Error(
      '[Nachocode] `useNachocode` must be used within a `<NachoProvider>` component.'
    );
  }
  return context;
}
