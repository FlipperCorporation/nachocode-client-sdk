// Module dependencies
import { createContext, createElement, useContext } from 'react';
import type { ReactElement, ReactNode } from 'react';

// Custom module dependencies
import type { NachocodeState, OnInitialized } from './types';
import { useNachocodeLoader } from './useNachocode';

/**
 * `NachoProvider` props
 */
export type NachoProviderProps = {
  /**
   * nachocode 대시보드에서 발급받은 API Key
   */
  apiKey: string;
  /**
   * SDK 초기화 옵션
   */
  options?: Nachocode.InitializeOptions;
  /**
   * 로드할 SDK 버전. 생략하면 최신 버전을 로드한다.
   */
  version?: Nachocode.VersionString;
  /**
   * SDK 초기화 완료(`init`) 이벤트 콜백
   */
  onInitialized?: OnInitialized;
  children: ReactNode;
};

// Provider 밖에서 사용했는지 구분할 수 있도록 기본값은 `null`
const NachoContext = createContext<NachocodeState | null>(null);

/**
 * nachocode SDK를 로드하고, 하위 컴포넌트에 로드 상태를 제공하는 Provider
 */
export function NachoProvider({
  apiKey,
  options,
  version,
  onInitialized,
  children,
}: NachoProviderProps): ReactElement {
  const state = useNachocodeLoader(
    'NachoProvider',
    apiKey,
    options,
    version,
    onInitialized
  );

  // JSX 대신 `createElement` 를 사용해 `react/jsx-runtime` 에 의존하지 않는다. (React 16.8+ 지원)
  return createElement(NachoContext.Provider, { value: state }, children);
}

/**
 * `NachoProvider` 가 제공하는 SDK 로드 상태를 반환하는 훅
 * @throws `NachoProvider` 밖에서 호출한 경우
 */
export function useNachocodeContext(): NachocodeState {
  const context = useContext(NachoContext);
  if (!context) {
    throw new Error(
      '[Nachocode] `useNachocodeContext` must be used within a `<NachoProvider>` component.'
    );
  }
  return context;
}
