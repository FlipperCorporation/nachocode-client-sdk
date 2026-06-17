import { jest } from '@jest/globals';
import { act, render, screen, waitFor } from '@testing-library/react';
import { NachoProvider, useNachocodeContext } from '../src/NachocodeProvider';

// 🔥 loadNachocode를 Mock 처리
jest.mock('../src/loadNachocode', () => ({
  loadNachocode: jest.fn(() =>
    Promise.resolve({
      init: jest.fn(),
      env: { isInitialized: () => true },
    })
  ),
}));

const TestComponent = () => {
  const { isLoading, isError, error } = useNachocodeContext();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return <p>Nachocode Loaded!</p>;
};

describe('NachoProvider', () => {
  beforeEach(() => {
    // 🔥 `window.Nachocode`를 mock으로 설정
    Object.defineProperty(globalThis as any, 'Nachocode', {
      value: {
        init: jest.fn(),
        env: { isInitialized: () => true },
      },
      writable: true,
    });
  });

  afterEach(() => {
    delete (globalThis as any).Nachocode; // ✅ Nachocode 초기화
  });

  test('Provider가 정상적으로 Context를 제공하는지 확인', async () => {
    render(
      <NachoProvider apiKey="test-key">
        <TestComponent />
      </NachoProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText('Nachocode Loaded!')).toBeInTheDocument()
    );
  });

  test('Provider 없이 useNachocodeContext() 호출 시 오류가 발생하는지 확인', () => {
    expect(() => {
      act(() => {
        render(<TestComponent />);
      });
    }).toThrow(
      '[Nachocode] `useNachocodeContext` must be used within a `<NachoProvider>` component.'
    );
  });
});
