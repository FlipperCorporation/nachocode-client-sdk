import {
  LATEST_VERSION,
  SCRIPT_ID,
  SCRIPT_NAME,
  SCRIPT_URL,
} from '../src/constants';
import { createSdkMock } from './helpers/sdkMock';

type LoadNachocode = typeof import('../src/loadNachocode').loadNachocode;

const getScripts = () =>
  Array.from(document.querySelectorAll<HTMLScriptElement>(`#${SCRIPT_ID}`));

const setSdk = (sdk?: Record<string, any>) => {
  (window as any).Nachocode = sdk;
};

/** CDN 스크립트 로드 완료를 흉내낸다. */
const finishScriptLoad = (sdk?: Record<string, any>) => {
  if (sdk) setSdk(sdk);
  getScripts()[0].dispatchEvent(new Event('load'));
};

/** CDN 스크립트 로드 실패를 흉내낸다. */
const failScriptLoad = () => {
  getScripts()[0].dispatchEvent(new Event('error'));
};

describe('loadNachocode', () => {
  let loadNachocode: LoadNachocode;

  beforeEach(async () => {
    document.head.innerHTML = '';
    setSdk(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // 모듈 내부 캐시(cachedPromise)를 테스트마다 초기화
    jest.resetModules();
    ({ loadNachocode } = await import('../src/loadNachocode'));
  });

  describe('인자 검증', () => {
    test('apiKey가 없으면 스크립트를 추가하지 않고 거부한다', async () => {
      await expect(loadNachocode('')).rejects.toThrow(
        '[Nachocode] apiKey is required but was not provided.'
      );
      expect(getScripts()).toHaveLength(0);
    });
  });

  describe('스크립트 로드', () => {
    test('최신 버전 스크립트를 head에 추가하고, 로드 후 SDK를 초기화한다', async () => {
      const sdk = createSdkMock();
      const options = { logger: true };

      const promise = loadNachocode('test-key', options);

      const [script] = getScripts();
      expect(script.parentNode).toBe(document.head);
      expect(script.async).toBe(true);
      expect(script.src).toBe(
        `${SCRIPT_URL}@latest/${SCRIPT_NAME}?v=${LATEST_VERSION}`
      );

      finishScriptLoad(sdk);

      await expect(promise).resolves.toBe(sdk);
      expect(sdk.initAsync).toHaveBeenCalledTimes(1);
      expect(sdk.initAsync).toHaveBeenCalledWith('test-key', options);
    });

    test('version을 지정하면 해당 버전의 스크립트를 로드한다', async () => {
      const promise = loadNachocode('test-key', undefined, '1.10.0');

      expect(getScripts()[0].src).toBe(
        `${SCRIPT_URL}@1.10.0/${SCRIPT_NAME}?v=${LATEST_VERSION}`
      );

      finishScriptLoad(createSdkMock());
      await promise;
    });

    test('version에 포함된 경로 문자는 인코딩되어 CDN 경로를 벗어나지 못한다', async () => {
      const promise = loadNachocode('test-key', undefined, '../evil' as any);

      expect(getScripts()[0].src).toBe(
        `${SCRIPT_URL}@..%2Fevil/${SCRIPT_NAME}?v=${LATEST_VERSION}`
      );

      finishScriptLoad(createSdkMock());
      await promise;
    });

    test('동시에 여러 번 호출해도 스크립트 로드와 초기화는 한 번만 수행한다', async () => {
      const sdk = createSdkMock();

      const first = loadNachocode('test-key');
      const second = loadNachocode('test-key');

      expect(second).toBe(first);
      expect(getScripts()).toHaveLength(1);

      finishScriptLoad(sdk);

      await expect(first).resolves.toBe(sdk);
      expect(sdk.initAsync).toHaveBeenCalledTimes(1);
      // 완료된 뒤의 호출도 같은 결과를 재사용
      await expect(loadNachocode('test-key')).resolves.toBe(sdk);
      expect(sdk.initAsync).toHaveBeenCalledTimes(1);
    });

    test('모듈이 중복으로 실행되어도 로드 중인 스크립트를 재사용한다', async () => {
      const sdk = createSdkMock();
      const first = loadNachocode('test-key');

      // 번들에 이 모듈이 두 번 포함되었거나 HMR 로 다시 실행된 상황
      jest.resetModules();
      const { loadNachocode: loadNachocodeFromCopy } =
        await import('../src/loadNachocode');
      const second = loadNachocodeFromCopy('test-key');

      expect(second).not.toBe(first);
      expect(getScripts()).toHaveLength(1);

      finishScriptLoad(sdk);

      await expect(first).resolves.toBe(sdk);
      await expect(second).resolves.toBe(sdk);
    });

    test('로드 상태를 알 수 없는 기존 스크립트는 재사용하지 않는다', async () => {
      // ex. 이전에 로드에 실패한 채 남아 있는 스크립트
      const stale = document.createElement('script');
      stale.id = SCRIPT_ID;
      document.head.appendChild(stale);

      const promise = loadNachocode('test-key');

      const scripts = getScripts();
      expect(scripts).toHaveLength(2);

      setSdk(createSdkMock());
      scripts[1].dispatchEvent(new Event('load'));
      await expect(promise).resolves.toBeDefined();
    });

    test('스크립트 로드에 실패하면 거부하고, 스크립트를 제거한다', async () => {
      const promise = loadNachocode('test-key');

      failScriptLoad();

      await expect(promise).rejects.toThrow(
        '[Nachocode] An error occurred while loading the SDK.'
      );
      expect(getScripts()).toHaveLength(0);
    });

    test('스크립트 로드에 실패한 뒤 다시 호출하면 재시도한다', async () => {
      const failed = loadNachocode('test-key');
      failScriptLoad();
      await expect(failed).rejects.toThrow();

      const sdk = createSdkMock();
      const retried = loadNachocode('test-key');

      expect(retried).not.toBe(failed);
      expect(getScripts()).toHaveLength(1);

      finishScriptLoad(sdk);
      await expect(retried).resolves.toBe(sdk);
    });

    test('스크립트는 로드됐지만 window.Nachocode가 없으면 거부한다', async () => {
      const promise = loadNachocode('test-key');

      finishScriptLoad();

      await expect(promise).rejects.toThrow(
        '[Nachocode] Failed to initialize Nachocode SDK instance.'
      );
      expect(getScripts()).toHaveLength(0);
    });
  });

  describe('이미 로드된 SDK', () => {
    test('window.Nachocode가 있으면 스크립트를 추가하지 않고 바로 초기화한다', async () => {
      const sdk = createSdkMock();
      setSdk(sdk);

      await expect(loadNachocode('test-key')).resolves.toBe(sdk);

      expect(getScripts()).toHaveLength(0);
      expect(sdk.initAsync).toHaveBeenCalledWith('test-key', undefined);
    });

    test('동시에 여러 번 호출해도 초기화는 한 번만 수행한다', async () => {
      const sdk = createSdkMock();
      setSdk(sdk);

      const first = loadNachocode('test-key');
      const second = loadNachocode('test-key');

      expect(second).toBe(first);
      await first;
      expect(sdk.initAsync).toHaveBeenCalledTimes(1);
    });

    test('이미 초기화된 SDK는 다시 초기화하지 않는다', async () => {
      const sdk = createSdkMock({ initialized: true });
      setSdk(sdk);

      await expect(loadNachocode('test-key')).resolves.toBe(sdk);

      expect(sdk.initAsync).not.toHaveBeenCalled();
      expect(sdk.init).not.toHaveBeenCalled();
    });

    test('window.Nachocode.env가 없으면 거부한다', async () => {
      setSdk({});

      await expect(loadNachocode('test-key')).rejects.toThrow(
        '[Nachocode] SDK is not available on the window object.'
      );
    });
  });

  describe('초기화 방식', () => {
    // '1.10.0' < '1.4.2' 처럼 버전을 문자열로 비교하면 사전순으로 판정되어
    // 1.10.0 이상에서 동기 `init` 이 호출되던 문제의 회귀 테스트
    test.each(['1.4.2', '1.9.0', '1.10.0', '1.11.4'])(
      'SDK %s 는 initAsync로 초기화한다',
      async version => {
        const sdk = createSdkMock({ version });
        setSdk(sdk);

        await loadNachocode('test-key');

        expect(sdk.initAsync).toHaveBeenCalledTimes(1);
        expect(sdk.init).not.toHaveBeenCalled();
      }
    );

    test('initAsync가 없는 구버전 SDK는 init으로 초기화한다', async () => {
      const sdk = createSdkMock({ withInitAsync: false, version: '1.4.1' });
      setSdk(sdk);

      await expect(loadNachocode('test-key', { sandbox: true })).resolves.toBe(
        sdk
      );

      expect(sdk.init).toHaveBeenCalledWith('test-key', { sandbox: true });
    });

    test('초기화에 실패하면 원인을 cause에 담아 거부한다', async () => {
      const cause = new Error('invalid api key');
      const sdk = createSdkMock();
      sdk.initAsync.mockRejectedValueOnce(cause);
      setSdk(sdk);

      const error = await loadNachocode('test-key').catch(e => e);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        '[Nachocode] An error occurred during SDK initialization.'
      );
      expect(error.cause).toBe(cause);
    });

    test('초기화에 실패한 뒤 다시 호출하면 재시도한다', async () => {
      const sdk = createSdkMock();
      sdk.initAsync.mockRejectedValueOnce(new Error('temporary failure'));
      setSdk(sdk);

      await expect(loadNachocode('test-key')).rejects.toThrow();
      await expect(loadNachocode('test-key')).resolves.toBe(sdk);

      expect(sdk.initAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('onInitialized', () => {
    test('초기화 전에 init 이벤트 리스너로 등록한다', async () => {
      const sdk = createSdkMock();
      const onInitialized = jest.fn();
      const callOrder: string[] = [];
      sdk.event.on.mockImplementation(() => callOrder.push('event.on'));
      sdk.initAsync.mockImplementation(async () => {
        callOrder.push('initAsync');
      });
      setSdk(sdk);

      await loadNachocode('test-key', undefined, undefined, onInitialized);

      expect(sdk.event.on).toHaveBeenCalledWith('init', onInitialized);
      expect(callOrder).toEqual(['event.on', 'initAsync']);
    });

    test('스크립트를 직접 로드한 경우에도 등록한다', async () => {
      const sdk = createSdkMock();
      const onInitialized = jest.fn();

      const promise = loadNachocode(
        'test-key',
        undefined,
        undefined,
        onInitialized
      );
      finishScriptLoad(sdk);
      await promise;

      expect(sdk.event.on).toHaveBeenCalledWith('init', onInitialized);
    });

    test('onInitialized가 없으면 이벤트 리스너를 등록하지 않는다', async () => {
      const sdk = createSdkMock();
      setSdk(sdk);

      await loadNachocode('test-key');

      expect(sdk.event.on).not.toHaveBeenCalled();
    });

    test('event 네임스페이스가 없는 구버전 SDK에서도 오류 없이 초기화한다', async () => {
      const sdk = createSdkMock({ withEvent: false, withInitAsync: false });
      setSdk(sdk);

      await expect(
        loadNachocode('test-key', undefined, undefined, jest.fn())
      ).resolves.toBe(sdk);

      expect(sdk.init).toHaveBeenCalledTimes(1);
    });
  });
});
