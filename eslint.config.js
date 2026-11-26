import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    'dist/',
    'coverage/',
    'node_modules/',
    // 설정 파일(JS)은 린트 대상에서 제외
    '**/*.js',
    '**/*.cjs',
    '**/*.mjs',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // Prettier 와 충돌하는 규칙을 끄고, 포맷 위반을 린트 오류로 보고 (`.prettierrc` 사용)
  prettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
