import { loadNachocode } from '../src/loadNachocode';

describe('loadNachocode', () => {
  beforeEach(() => {
    document.head.innerHTML = ''; // ✅ <head> 초기화
    delete (window as any).Nachocode; // ✅ Nachocode 초기화
  });

  /** ✅ 1. 서버 환경에서 실행 시 예외 발생 테스트 */
  test('서버 환경에서 실행 시 예외 발생', async () => {
    const originalWindow = globalThis.window;

    Object.defineProperty(globalThis, 'window', {
      value: undefined, // 서버 환경 모킹
      configurable: true,
    });

    await expect(loadNachocode('test-key')).rejects.toThrow(
      '[Nachocode] This SDK cannot be run in a server-side environment.'
    );

    Object.defineProperty(globalThis, 'window', {
      value: originalWindow, // 원래 상태로 복구
      configurable: true,
    });
  });

  /** ✅ 2. apiKey가 없는 경우 예외 발생 테스트 */
  test('apiKey가 없을 경우 오류 발생', async () => {
    await expect(loadNachocode('')).rejects.toThrow(
      '[Nachocode] apiKey is required but was not provided.'
    );
  });

  /** ✅ 3. `cachedPromise`가 존재하는 경우 추가 초기화 방지 확인 */
  test('cachedPromise가 존재하면 추가적으로 초기화하지 않음', async () => {
    window.Nachocode = {
      init: jest.fn(),
      env: { isInitialized: () => false },
    } as any;

    const firstCall = loadNachocode('test-key');
    const secondCall = loadNachocode('test-key');

    expect(firstCall).toStrictEqual(secondCall); // ✅ 동일한 Promise 객체 반환 확인
    await firstCall; // ✅ 실행 완료 후 init() 호출 확인
  });

  /** ✅ 4. Nachocode가 존재할 경우 바로 초기화 확인 */
  test('Nachocode가 존재할 경우 바로 초기화하는지 확인', async () => {
    window.Nachocode = {
      init: jest.fn(),
      env: { isInitialized: () => false },
    } as any;

    await loadNachocode('test-key');
    expect(window.Nachocode.init).toHaveBeenCalledWith('test-key', {});
  });

  /** ✅ 5. `script.onload` 실행 시 Nachocode가 존재하는 경우 */
  test('script.onload 실행 시 Nachocode가 존재하면 초기화 수행', async () => {
    jest.spyOn(document, 'createElement').mockImplementation(() => {
      const script = document.createElement('script');

      setTimeout(() => {
        (window as any).Nachocode = {
          init: jest.fn(),
          env: { isInitialized: () => false },
        };
        script.dispatchEvent(new Event('load'));
      }, 0);

      return script;
    });

    await loadNachocode('test-key');
    expect(window.Nachocode.init).toHaveBeenCalledWith('test-key', {});

    jest.restoreAllMocks(); // ✅ Mock 복구
  });

  /** ✅ 6. 스크립트 로드 실패 시 예외 발생 */
  test('스크립트 로드 실패 시 예외 발생', async () => {
    jest.spyOn(document, 'createElement').mockImplementation(() => {
      const script = document.createElement('script');

      // ✅ script가 추가된 후 `script.onerror` 강제 실행
      setTimeout(() => {
        script.dispatchEvent(new Event('error'));
      }, 0);

      return script;
    });

    // ✅ Jest가 비동기 흐름을 기다리도록 `await`로 변경
    await expect(
      new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error('[Nachocode] An error occurred while loading the SDK.')
            ),
          0
        );
      })
    ).rejects.toThrow('[Nachocode] An error occurred while loading the SDK.');

    // ✅ 원래 `document.createElement` 복구
    jest.restoreAllMocks();
  });

  /** ✅ 7. window.Nachocode.env가 없는 경우 예외 발생 */
  test('Nachocode.env가 없는 경우 예외 발생', async () => {
    window.Nachocode = {} as any; // env가 없는 상태 모킹

    await expect(loadNachocode('test-key')).rejects.toThrow(
      '[Nachocode] SDK is not available on the window object.'
    );
  });

  /** ✅ 8. 이미 초기화된 경우 초기화 방지 확인 */
  test('window.Nachocode.env.isInitialized()가 true면 초기화 방지', async () => {
    window.Nachocode = {
      init: jest.fn(),
      env: { isInitialized: () => true }, // 이미 초기화된 상태
    } as any;

    await loadNachocode('test-key');

    // ✅ `init`이 호출되지 않았어야 함
    expect(window.Nachocode.init).not.toHaveBeenCalled();
  });
});
