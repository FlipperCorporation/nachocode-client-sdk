// Custom module dependencies
import {
  LATEST_VERSION,
  SCRIPT_ID,
  SCRIPT_NAME,
  SCRIPT_URL,
} from './constants';

let cachedPromise: Promise<typeof Nachocode> | undefined;

export function loadNachocode(
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
  }) => void
): Promise<typeof Nachocode> {
  if (typeof window === 'undefined') {
    return Promise.reject(
      // 서버 환경에서는 실행할 수 없습니다.
      new Error(
        '[Nachocode] This SDK cannot be run in a server-side environment.'
      )
    );
  }

  if (!apiKey) {
    return Promise.reject(
      // apiKey가 제공되지 않았습니다.
      new Error('[Nachocode] apiKey is required but was not provided.')
    );
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  if (window.Nachocode) {
    if (onInitialized) {
      window.Nachocode.event.on(
        Nachocode.event.EVENT_TYPES.INIT,
        onInitialized
      );
    }
    return initializeNachocode(apiKey, options);
  }

  const script = document.createElement('script');
  script.src = `${SCRIPT_URL}@${version || 'latest'}/${SCRIPT_NAME}?v=${LATEST_VERSION}`;
  script.id = SCRIPT_ID;
  script.async = true;
  document.head.appendChild(script);

  cachedPromise = new Promise((resolve, reject) => {
    script.onload = () => {
      if (window.Nachocode) {
        if (onInitialized) {
          window.Nachocode.event.on(
            Nachocode.event.EVENT_TYPES.INIT,
            onInitialized
          );
        }
        initializeNachocode(apiKey, options).then(resolve).catch(reject);
      } else {
        reject(
          // SDK 인스턴스 초기화 실패
          new Error('[Nachocode] Failed to initialize Nachocode SDK instance.')
        );
      }
    };

    script.onerror = () =>
      // SDK 로드 중 오류 발생
      reject(new Error('[Nachocode] An error occurred while loading the SDK.'));
  });

  return cachedPromise;
}

async function initializeNachocode(
  apiKey: string,
  options?: Nachocode.InitializeOptions
): Promise<typeof Nachocode> {
  if (!window.Nachocode || !window.Nachocode.env) {
    // SDK가 존재하지 않습니다.
    throw new Error('[Nachocode] SDK is not available on the window object.');
  }

  try {
    if (!window.Nachocode.env.isInitialized()) {
      if (window.Nachocode.env.getSDKVersion() < '1.4.2') {
        window.Nachocode.init(apiKey, options);
      } else {
        await window.Nachocode.initAsync(apiKey, options);
      }
    }
    return window.Nachocode;
  } catch (error) {
    console.error(
      '[Nachocode] An error occurred during SDK initialization.',
      error
    );
    // SDK 초기화 실패
    throw new Error('[Nachocode] An error occurred during SDK initialization.');
  }
}
