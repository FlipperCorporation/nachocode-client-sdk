/**
 * 구버전 React 환경을 흉내내어 호환성을 확인한다.
 *
 * - `loadNachocode` 는 React 버전과 무관하게 사용할 수 있어야 한다.
 * - `NachoProvider`, `useNachocode`, `useNachocodeContext` 는 훅(React 16.8+)이 필요하다.
 */
describe('구버전 React 호환성', () => {
  const importWithReact = async (overrides: Record<string, unknown>) => {
    jest.resetModules();
    jest.doMock('react', () => ({
      ...jest.requireActual<typeof import('react')>('react'),
      ...overrides,
    }));

    return import('../src/index');
  };

  afterEach(() => {
    jest.dontMock('react');
    jest.resetModules();
  });

  test('createContext 가 없는 React(16.3 미만)에서도 모듈을 불러오고 loadNachocode 를 쓸 수 있다', async () => {
    const sdk = await importWithReact({
      createContext: undefined,
      useContext: undefined,
      useEffect: undefined,
      useState: undefined,
    });

    expect(typeof sdk.loadNachocode).toBe('function');
    await expect(sdk.loadNachocode('')).rejects.toThrow(
      '[Nachocode] apiKey is required but was not provided.'
    );
  });

  test('훅이 없는 React(16.8 미만)에서 useNachocode 를 호출하면 안내 메시지를 던진다', async () => {
    const sdk = await importWithReact({
      useContext: undefined,
      useEffect: undefined,
      useState: undefined,
    });

    expect(() => sdk.useNachocode('test-key')).toThrow(
      '[Nachocode] `useNachocode` requires React 16.8 or later. Use `loadNachocode` instead.'
    );
  });

  test('훅이 없는 React(16.8 미만)에서 NachoProvider 를 렌더링하면 안내 메시지를 던진다', async () => {
    const sdk = await importWithReact({
      useContext: undefined,
      useEffect: undefined,
      useState: undefined,
    });

    expect(() =>
      sdk.NachoProvider({ apiKey: 'test-key', children: null })
    ).toThrow(
      '[Nachocode] `NachoProvider` requires React 16.8 or later. Use `loadNachocode` instead.'
    );
  });

  test('훅이 없는 React(16.8 미만)에서 useNachocodeContext 를 호출하면 안내 메시지를 던진다', async () => {
    const sdk = await importWithReact({
      useContext: undefined,
      useEffect: undefined,
      useState: undefined,
    });

    expect(() => sdk.useNachocodeContext()).toThrow(
      '[Nachocode] `useNachocodeContext` requires React 16.8 or later. Use `loadNachocode` instead.'
    );
  });
});
