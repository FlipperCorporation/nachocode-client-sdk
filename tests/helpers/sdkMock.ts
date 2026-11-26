type SdkMockOptions = {
  /** 이미 초기화된 SDK 인지 여부 */
  initialized?: boolean;
  /** `initAsync` 제공 여부 (SDK 1.4.2 미만은 미제공) */
  withInitAsync?: boolean;
  /** `event` 네임스페이스 제공 여부 (SDK 1.0.2 미만은 미제공) */
  withEvent?: boolean;
  /** `env.getSDKVersion()` 반환값 */
  version?: string;
};

/**
 * 테스트용 `window.Nachocode` mock 생성
 */
export function createSdkMock({
  initialized = false,
  withInitAsync = true,
  withEvent = true,
  version = '1.11.4',
}: SdkMockOptions = {}) {
  let isInitialized = initialized;

  const sdk: Record<string, any> = {
    init: jest.fn(() => {
      isInitialized = true;
    }),
    env: {
      isInitialized: jest.fn(() => isInitialized),
      getSDKVersion: jest.fn(() => version),
    },
  };

  if (withInitAsync) {
    sdk.initAsync = jest.fn(async () => {
      isInitialized = true;
    });
  }

  if (withEvent) {
    sdk.event = { on: jest.fn(), off: jest.fn() };
  }

  return sdk;
}

/**
 * 외부에서 결과를 결정할 수 있는 Promise 생성
 */
export function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
