export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Jest DOM matchers 로드
  roots: ['<rootDir>/tests'], // tests 폴더 내 테스트만 실행
  collectCoverageFrom: ['src/**/*.{ts,tsx}'], // 테스트에서 불러오지 않은 소스도 커버리지에 포함
  restoreMocks: true, // 테스트마다 spy/mock 원복
};
