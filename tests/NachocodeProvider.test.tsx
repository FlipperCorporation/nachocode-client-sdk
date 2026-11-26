import { render, screen } from '@testing-library/react';
import { loadNachocode } from '../src/loadNachocode';
import { NachoProvider, useNachocodeContext } from '../src/NachocodeProvider';
import { createSdkMock } from './helpers/sdkMock';

jest.mock('../src/loadNachocode', () => ({ loadNachocode: jest.fn() }));

const mockedLoadNachocode = jest.mocked(loadNachocode);

const TestComponent = () => {
  const { isLoading, isError, error, Nachocode } = useNachocodeContext();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return <p>Nachocode Loaded! (v{Nachocode.env.getSDKVersion()})</p>;
};

describe('NachoProvider', () => {
  beforeEach(() => {
    mockedLoadNachocode.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test('로드가 끝나면 Context로 SDK를 제공한다', async () => {
    mockedLoadNachocode.mockResolvedValue(
      createSdkMock({ version: '1.11.4' }) as any
    );

    render(
      <NachoProvider apiKey="test-key">
        <TestComponent />
      </NachoProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(
      await screen.findByText('Nachocode Loaded! (v1.11.4)')
    ).toBeInTheDocument();
  });

  test('로드에 실패하면 Context로 에러를 제공한다', async () => {
    mockedLoadNachocode.mockRejectedValue(new Error('load failed'));

    render(
      <NachoProvider apiKey="test-key">
        <TestComponent />
      </NachoProvider>
    );

    expect(await screen.findByText('Error: load failed')).toBeInTheDocument();
  });

  test('props를 loadNachocode에 그대로 전달한다', async () => {
    const options = { sandbox: true };
    const onInitialized = jest.fn();
    mockedLoadNachocode.mockResolvedValue(createSdkMock() as any);

    render(
      <NachoProvider
        apiKey="test-key"
        options={options}
        version="1.11.4"
        onInitialized={onInitialized}
      >
        <TestComponent />
      </NachoProvider>
    );
    await screen.findByText(/Nachocode Loaded!/);

    expect(mockedLoadNachocode).toHaveBeenCalledWith(
      'test-key',
      options,
      '1.11.4',
      onInitialized
    );
  });

  test('logger 옵션이 켜져 있으면 Provider 이름으로 로그를 남긴다', async () => {
    mockedLoadNachocode.mockResolvedValue(createSdkMock() as any);

    render(
      <NachoProvider apiKey="test-key" options={{ logger: true }}>
        <TestComponent />
      </NachoProvider>
    );
    await screen.findByText(/Nachocode Loaded!/);

    expect(console.log).toHaveBeenCalledWith(
      '[Nachocode] NachoProvider mounted.'
    );
  });
});

describe('useNachocodeContext', () => {
  test('Provider 없이 호출하면 오류가 발생한다', () => {
    // React가 렌더링 오류를 콘솔에 출력하므로 테스트 출력에서 숨긴다.
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      '[Nachocode] `useNachocodeContext` must be used within a `<NachoProvider>` component.'
    );
  });
});
