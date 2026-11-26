import { act, renderHook, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { loadNachocode } from '../src/loadNachocode';
import { useNachocode } from '../src/useNachocode';
import { createDeferred, createSdkMock } from './helpers/sdkMock';

jest.mock('../src/loadNachocode', () => ({ loadNachocode: jest.fn() }));

const mockedLoadNachocode = jest.mocked(loadNachocode);

describe('useNachocode', () => {
  beforeEach(() => {
    mockedLoadNachocode.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test('로딩 상태로 시작해, 로드가 끝나면 SDK를 반환한다', async () => {
    const sdk = createSdkMock();
    mockedLoadNachocode.mockResolvedValue(sdk as any);

    const { result } = renderHook(() => useNachocode('test-key'));

    expect(result.current).toEqual({
      isLoading: true,
      isError: false,
      error: null,
      Nachocode: null,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      isLoading: false,
      isError: false,
      error: null,
      Nachocode: sdk,
    });
  });

  test('인자를 loadNachocode에 그대로 전달한다', async () => {
    const options = { sandbox: true };
    const onInitialized = jest.fn();
    mockedLoadNachocode.mockResolvedValue(createSdkMock() as any);

    const { result } = renderHook(() =>
      useNachocode('test-key', options, '1.11.4', onInitialized)
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockedLoadNachocode).toHaveBeenCalledWith(
      'test-key',
      options,
      '1.11.4',
      onInitialized
    );
  });

  test('로드에 실패하면 에러 상태를 반환한다', async () => {
    const error = new Error('load failed');
    mockedLoadNachocode.mockRejectedValue(error);

    const { result } = renderHook(() => useNachocode('test-key'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      isLoading: false,
      isError: true,
      error,
      Nachocode: null,
    });
  });

  test('Error가 아닌 값으로 거부되어도 error는 Error 객체다', async () => {
    mockedLoadNachocode.mockRejectedValue('load failed');

    const { result } = renderHook(() => useNachocode('test-key'));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('load failed');
  });

  test('언마운트된 뒤에 끝난 로드 결과는 반영하지 않는다', async () => {
    const deferred = createDeferred<any>();
    mockedLoadNachocode.mockReturnValue(deferred.promise);

    const { result, unmount } = renderHook(() => useNachocode('test-key'));
    unmount();

    await act(async () => {
      deferred.resolve(createSdkMock());
    });

    expect(result.current.isLoading).toBe(true);
  });

  test('apiKey가 바뀌면 다시 로드하고, 이전 로드 결과는 무시한다', async () => {
    const first = createDeferred<any>();
    const second = createDeferred<any>();
    const firstSdk = createSdkMock();
    const secondSdk = createSdkMock();
    mockedLoadNachocode
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);

    const { result, rerender } = renderHook(
      ({ apiKey }) => useNachocode(apiKey),
      { initialProps: { apiKey: 'first-key' } }
    );
    rerender({ apiKey: 'second-key' });

    expect(mockedLoadNachocode).toHaveBeenCalledTimes(2);

    // 나중 요청이 먼저 끝나고, 이전 요청이 뒤늦게 끝나는 경우
    await act(async () => {
      second.resolve(secondSdk);
    });
    await act(async () => {
      first.resolve(firstSdk);
    });

    expect(result.current.Nachocode).toBe(secondSdk);
  });

  test('options 객체가 렌더링마다 새로 만들어져도 다시 로드하지 않는다', async () => {
    mockedLoadNachocode.mockResolvedValue(createSdkMock() as any);

    const { result, rerender } = renderHook(() =>
      useNachocode('test-key', { logger: false })
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    rerender();
    rerender();

    expect(mockedLoadNachocode).toHaveBeenCalledTimes(1);
  });

  test('StrictMode에서 effect가 두 번 실행되어도 정상적으로 로드한다', async () => {
    const sdk = createSdkMock();
    mockedLoadNachocode.mockResolvedValue(sdk as any);

    const { result } = renderHook(() => useNachocode('test-key'), {
      wrapper: StrictMode,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.Nachocode).toBe(sdk);
  });

  test('logger 옵션이 켜져 있으면 진행 상황을 로그로 남긴다', async () => {
    const sdk = createSdkMock();
    mockedLoadNachocode.mockResolvedValue(sdk as any);

    const { result } = renderHook(() =>
      useNachocode('test-key', { logger: true })
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(console.log).toHaveBeenCalledWith(
      '[Nachocode] useNachocode mounted.'
    );
    expect(console.log).toHaveBeenCalledWith(
      '[Nachocode] Nachocode SDK successfully loaded:',
      sdk
    );
  });

  test('logger 옵션이 없으면 로그를 남기지 않는다', async () => {
    mockedLoadNachocode.mockResolvedValue(createSdkMock() as any);

    const { result } = renderHook(() => useNachocode('test-key'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(console.log).not.toHaveBeenCalled();
  });
});
