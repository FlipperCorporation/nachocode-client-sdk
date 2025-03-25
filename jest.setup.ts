import '@testing-library/jest-dom'; // ✅ Jest DOM matchers 로드

// 🔥 글로벌 window.Nachocode Mock 설정 (테스트 시 필요)
Object.defineProperty(window, 'Nachocode', {
  value: {
    init: jest.fn(),
    env: {
      isInitialized: () => false,
    },
  },
  writable: true,
});
