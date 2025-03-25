import { jest } from '@jest/globals';
import { act, render, screen, waitFor } from '@testing-library/react';
import { NachoProvider, useNachocode } from '../src/NachocodeProvider';

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
  const { loading, error } = useNachocode();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <p>Nachocode Loaded!</p>;
};

describe('NachoProvider', () => {
  beforeEach(() => {
    // 🔥 `window.Nachocode`를 mock으로 설정
    Object.defineProperty(global, 'Nachocode', {
      value: {
        init: jest.fn(),
        env: { isInitialized: () => true },
      },
      writable: true,
    });
  });

  afterEach(() => {
    delete (window as any).Nachocode; // ✅ Nachocode 초기화
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

  test('Provider 없이 useNachocode() 호출 시 오류가 발생하는지 확인', () => {
    expect(() => {
      act(() => {
        render(<TestComponent />);
      });
    }).toThrow(
      '[Nachocode] `useNachocode` must be used within a `<NachoProvider>` component.'
    );
  });
});
