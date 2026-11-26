// Module dependencies
import { useEffect, useState } from 'react';

// Custom module dependencies
import { loadNachocode } from './loadNachocode';
import type { NachocodeState, OnInitialized } from './types';

const LOADING_STATE: NachocodeState = {
  isLoading: true,
  isError: false,
  error: null,
  Nachocode: null,
};

/**
 * 훅(Hooks)을 지원하는 React 버전인지 확인한다.
 *
 * 훅은 React 16.8 부터 제공되므로, 하위 버전에서는 원인을 알기 어려운 오류
 * (`useState is not a function`) 대신 안내 메시지를 던진다.
 * @param caller - 오류 메시지에 표시할 호출 주체 이름
 * @internal
 */
export function assertHooksSupported(caller: string): void {
  if (typeof useState !== 'function') {
    throw new Error(
      `[Nachocode] \`${caller}\` requires React 16.8 or later. Use \`loadNachocode\` instead.`
    );
  }
}

/**
 * `useNachocode` 훅과 `NachoProvider` 가 공유하는 SDK 로드 로직
 * @param caller - 로그에 표시할 호출 주체 이름
 * @internal
 */
export function useNachocodeLoader(
  caller: string,
  apiKey: string,
  options?: Nachocode.InitializeOptions,
  version?: Nachocode.VersionString,
  onInitialized?: OnInitialized
): NachocodeState {
  assertHooksSupported(caller);

  const [state, setState] = useState<NachocodeState>(LOADING_STATE);

  useEffect(() => {
    // effect 마다 별도의 플래그를 두어, 정리(cleanup)된 effect 의 결과가 상태에 반영되지 않게 한다.
    let isActive = true;

    if (options?.logger) {
      // 마운트됨
      console.log(`[Nachocode] ${caller} mounted.`);
    }

    loadNachocode(apiKey, options, version, onInitialized)
      .then(sdk => {
        if (!isActive) return;

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
      .catch((error: unknown) => {
        if (!isActive) return;

        // SDK 로드 실패
        console.error('[Nachocode] Failed to load Nachocode SDK:', error);
        setState({
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error(String(error)),
          Nachocode: null,
        });
      });

    return () => {
      isActive = false;
    };
    // `options`, `onInitialized` 는 렌더링마다 새로 만들어지는 경우가 많아 의존성에서 제외한다.
    // (SDK는 한 번만 초기화되므로 최초 호출 시점의 값만 사용된다.)
  }, [apiKey, version]);

  return state;
}

/**
 * nachocode SDK를 로드하고 로드 상태를 반환하는 훅
 * @param apiKey - nachocode 대시보드에서 발급받은 API Key
 * @param options - SDK 초기화 옵션
 * @param version - 로드할 SDK 버전. 생략하면 최신 버전을 로드한다.
 * @param onInitialized - SDK 초기화 완료(`init`) 이벤트 콜백
 */
export function useNachocode(
  apiKey: string,
  options?: Nachocode.InitializeOptions,
  version?: Nachocode.VersionString,
  onInitialized?: OnInitialized
): NachocodeState {
  return useNachocodeLoader(
    'useNachocode',
    apiKey,
    options,
    version,
    onInitialized
  );
}
