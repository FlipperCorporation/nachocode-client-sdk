// Custom module dependencies
import {
  INIT_EVENT,
  LATEST_VERSION,
  SCRIPT_ID,
  SCRIPT_LOADING_ATTRIBUTE,
  SCRIPT_NAME,
  SCRIPT_URL,
} from './constants';
import type { NachocodeSDK, OnInitialized } from './types';

/**
 * 진행 중이거나 완료된 SDK 로드 작업
 *
 * - 동시에 여러 번 호출되어도 스크립트 로드와 초기화는 한 번만 수행한다.
 * - 실패하면 비워서 다음 호출에서 다시 시도할 수 있게 한다.
 */
let cachedPromise: Promise<NachocodeSDK> | undefined;

/**
 * nachocode SDK 스크립트를 로드하고 초기화한다.
 *
 * 이미 로드가 진행 중이거나 완료된 경우 같은 `Promise` 를 반환하며,
 * 이때 새로 전달한 인자(`options`, `version`, `onInitialized`)는 사용되지 않는다.
 * @param apiKey - nachocode 대시보드에서 발급받은 API Key
 * @param options - SDK 초기화 옵션
 * @param version - 로드할 SDK 버전. 생략하면 최신 버전을 로드한다.
 * @param onInitialized - SDK 초기화 완료(`init`) 이벤트 콜백
 * @returns 초기화가 완료된 `Nachocode` SDK 객체
 */
export function loadNachocode(
  apiKey: string,
  options?: Nachocode.InitializeOptions,
  version?: Nachocode.VersionString,
  onInitialized?: OnInitialized
): Promise<NachocodeSDK> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
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

  const promise = loadScript(version).then(() =>
    initializeNachocode(apiKey, options, onInitialized)
  );
  cachedPromise = promise;

  // 실패한 작업을 캐시에 남겨두면 페이지를 새로고침하기 전까지 다시 시도할 수 없다.
  promise.catch(() => {
    if (cachedPromise === promise) {
      cachedPromise = undefined;
    }
  });

  return promise;
}

function getScriptUrl(version?: Nachocode.VersionString): string {
  const target = encodeURIComponent(version || 'latest');

  return `${SCRIPT_URL}@${target}/${SCRIPT_NAME}?v=${LATEST_VERSION}`;
}

/**
 * SDK 스크립트를 `<head>` 에 추가하고 로드가 끝날 때까지 기다린다.
 */
function loadScript(version?: Nachocode.VersionString): Promise<void> {
  // 이미 SDK가 로드된 경우 (ex. `<script>` 태그로 직접 추가)
  if (window.Nachocode) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    // 이 로더가 추가해 아직 로드 중인 스크립트가 있으면 중복으로 추가하지 않고 재사용한다.
    // (이 모듈이 여러 번 번들되었거나 HMR 로 다시 실행된 경우)
    // 표시가 없는 스크립트는 로드 상태를 알 수 없어, 이벤트를 영영 받지 못할 수 있으므로 재사용하지 않는다.
    const existingScript = document.getElementById(SCRIPT_ID);
    const isReusable =
      existingScript instanceof HTMLScriptElement &&
      existingScript.hasAttribute(SCRIPT_LOADING_ATTRIBUTE);
    const script = isReusable
      ? existingScript
      : document.createElement('script');

    const settle = (error?: Error) => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      script.removeAttribute(SCRIPT_LOADING_ATTRIBUTE);

      if (error) {
        // 다음 호출에서 스크립트를 다시 로드할 수 있도록 제거한다.
        script.parentNode?.removeChild(script);
        reject(error);
      } else {
        resolve();
      }
    };

    const onLoad = () =>
      settle(
        window.Nachocode
          ? undefined
          : // SDK 인스턴스 초기화 실패
            new Error(
              '[Nachocode] Failed to initialize Nachocode SDK instance.'
            )
      );

    const onError = () =>
      // SDK 로드 중 오류 발생
      settle(new Error('[Nachocode] An error occurred while loading the SDK.'));

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    if (!isReusable) {
      script.id = SCRIPT_ID;
      script.src = getScriptUrl(version);
      script.async = true;
      script.setAttribute(SCRIPT_LOADING_ATTRIBUTE, '');
      (document.head || document.documentElement).appendChild(script);
    }
  });
}

async function initializeNachocode(
  apiKey: string,
  options?: Nachocode.InitializeOptions,
  onInitialized?: OnInitialized
): Promise<NachocodeSDK> {
  const sdk = window.Nachocode;

  if (!sdk || !sdk.env) {
    // SDK가 존재하지 않습니다.
    throw new Error('[Nachocode] SDK is not available on the window object.');
  }

  try {
    // `event` 네임스페이스는 SDK 1.0.2 부터 제공된다.
    if (onInitialized && typeof sdk.event?.on === 'function') {
      sdk.event.on(INIT_EVENT, onInitialized);
    }

    if (!sdk.env.isInitialized()) {
      // `initAsync` 는 SDK 1.4.2 부터 제공된다.
      // 버전 문자열 비교('1.10.0' < '1.4.2')는 사전순이라 잘못 판정되므로 함수 존재 여부로 확인한다.
      if (typeof sdk.initAsync === 'function') {
        await sdk.initAsync(apiKey, options);
      } else {
        sdk.init(apiKey, options);
      }
    }

    return sdk;
  } catch (error) {
    console.error(
      '[Nachocode] An error occurred during SDK initialization.',
      error
    );
    // SDK 초기화 실패
    throw new Error(
      '[Nachocode] An error occurred during SDK initialization.',
      { cause: error }
    );
  }
}
