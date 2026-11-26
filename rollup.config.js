import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';

const input = 'src/index.ts'; // 엔트리 포인트

export default [
  {
    input,
    output: [
      // CJS 빌드 (`"type": "module"` 패키지이므로 반드시 `.cjs` 확장자 사용)
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
      // ESM 빌드
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      // TypeScript 변환 (타입 오류가 있으면 빌드 실패)
      typescript({
        tsconfig: './tsconfig.json',
        include: ['src/**/*', 'types/**/*'],
        tsconfigOverride: {
          compilerOptions: {
            noEmit: false,
            removeComments: true,
            sourceMap: true,
          },
        },
      }),
    ],
    // react 및 하위 경로(react/jsx-runtime 등)는 번들에 포함하지 않음
    external: [/^react($|\/)/],
  },
  {
    // 타입 선언 파일 빌드 (전역 `Nachocode` 네임스페이스 선언 포함)
    input,
    output: [
      { file: 'dist/index.d.ts', format: 'es' }, // ESM 소비자용
      { file: 'dist/index.d.cts', format: 'es' }, // CJS 소비자용
    ],
    plugins: [dts()],
  },
];
