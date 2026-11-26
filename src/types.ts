// Custom module dependencies
// 전역 `Nachocode` 네임스페이스 선언. 엔트리에서 이 파일을 참조해야
// 번들된 타입 선언(dist/index.d.ts)에 전역 타입이 함께 포함된다.
import type Nachocode from '../types/Nachocode';

/**
 * 초기화가 완료된 nachocode SDK 객체 (`window.Nachocode`)
 */
export type NachocodeSDK = typeof Nachocode;

/**
 * SDK 초기화 완료(`init`) 이벤트로 전달되는 애플리케이션 정보
 */
export type NachocodeInitResponse = {
  appKey?: string;
  appName?: string;
  appSourceVersion?: Nachocode.VersionString;
  appVersion?: Nachocode.VersionString;
  deviceModel?: string;
  os?: 'iOS' | 'Android';
  osVersion?: string;
  packageName?: string;
  pushToken?: string;
};

/**
 * SDK 초기화 완료 시 호출되는 콜백
 */
export type OnInitialized = (response?: NachocodeInitResponse) => void;

/**
 * SDK 로드 상태
 */
export type NachocodeState =
  | { isLoading: true; isError: false; error: null; Nachocode: null }
  | { isLoading: false; isError: true; error: Error; Nachocode: null }
  | {
      isLoading: false;
      isError: false;
      error: null;
      Nachocode: NachocodeSDK;
    };
