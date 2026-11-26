// Module dependencies
import { createContext, createElement, useContext } from 'react';
import type { Context, ReactElement, ReactNode } from 'react';

// Custom module dependencies
import type { NachocodeState, OnInitialized } from './types';
import { assertHooksSupported, useNachocodeLoader } from './useNachocode';

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

let nachoContext: Context<NachocodeState | null> | undefined;

/**
 * Context 는 처음 필요할 때 만든다.
 *
 * 모듈을 불러오는 시점에 `createContext` 를 호출하면, `createContext` 가 없는
 * 구버전 React(16.3 미만)에서는 `loadNachocode` 만 사용하려 해도 import 단계에서 실패한다.
 */
function getNachoContext(): Context<NachocodeState | null> {
  if (!nachoContext) {
    // Provider 밖에서 사용했는지 구분할 수 있도록 기본값은 `null`
    nachoContext = createContext<NachocodeState | null>(null);
  }
  return nachoContext;
}

/**
 * nachocode SDK를 로드하고, 하위 컴포넌트에 로드 상태를 제공하는 Provider
 *
 * React 16.8 이상이 필요하다.
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

  // JSX 대신 `createElement` 를 사용해 `react/jsx-runtime`(React 16.14+) 에 의존하지 않는다.
  return createElement(getNachoContext().Provider, { value: state }, children);
}

/**
 * `NachoProvider` 가 제공하는 SDK 로드 상태를 반환하는 훅
 *
 * React 16.8 이상이 필요하다.
 * @throws `NachoProvider` 밖에서 호출한 경우
 */
export function useNachocodeContext(): NachocodeState {
  assertHooksSupported('useNachocodeContext');

  const context = useContext(getNachoContext());
  if (!context) {
    throw new Error(
      '[Nachocode] `useNachocodeContext` must be used within a `<NachoProvider>` component.'
    );
  }
  return context;
}
