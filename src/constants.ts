export const SCRIPT_ID = 'nachocode-client-sdk';
/**
 * 이 로더가 추가했고 아직 로드 중인 스크립트에 붙이는 표시
 */
export const SCRIPT_LOADING_ATTRIBUTE = 'data-nachocode-loading';
export const SCRIPT_URL = 'https://cdn.nachocode.io/nachocode/client-sdk/';
export const SCRIPT_NAME = 'client-sdk.min.js';
export const LATEST_VERSION = '1.11.4';
/**
 * SDK 초기화 완료 이벤트 이름
 *
 * `Nachocode.event.EVENT_TYPES` 상수는 SDK 1.4.2 부터 제공되므로,
 * 하위 버전에서도 동작하도록 이벤트 이름을 직접 사용한다.
 */
export const INIT_EVENT = 'init';
