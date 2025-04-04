import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts', // 엔트리 포인트 지정
    output: [
      // CJS 빌드
      {
        file: 'dist/index.cjs.js',
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
      resolve(), // Node.js 모듈을 찾아주는 플러그인
      commonjs(), // CommonJS 모듈을 ESM으로 변환하는 플러그인
      typescript({
        tsconfig: './tsconfig.json',
        include: ['src/**/*', 'types/**/*'],
      }), // TypeScript 변환
    ],
    external: ['Nachocode', 'react', 'react-dom', 'react/jsx-runtime'], // 외부 모듈은 번들에 포함하지 않음
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }], // 타입 선언 파일 빌드
    plugins: [dts()],
  },
];
