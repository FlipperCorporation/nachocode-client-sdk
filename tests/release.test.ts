import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LATEST_VERSION } from '../src/constants';

const read = (...paths: string[]) =>
  readFileSync(join(__dirname, '..', ...paths), 'utf8');

/**
 * 릴리즈할 때 SDK 버전을 여러 곳에서 직접 수정하므로, 누락된 곳이 없는지 확인한다.
 */
describe('SDK 버전 표기 일관성', () => {
  test('타입 선언 파일(types/Nachocode.d.ts)의 버전이 LATEST_VERSION과 같다', () => {
    const declaration = read('types', 'Nachocode.d.ts');

    expect(declaration).toContain(
      `nachocode JavaScript Client SDK Type Declaration v${LATEST_VERSION}`
    );
    expect(declaration).toContain(
      `https://cdn.nachocode.io/nachocode/client-sdk/@${LATEST_VERSION}/Nachocode.d.ts`
    );
  });

  test('README의 버전 안내가 LATEST_VERSION과 같다', () => {
    const readme = read('README.md');

    expect(readme).toContain(`현재 최신 버전 v.${LATEST_VERSION}`);
    expect(readme).toContain(
      `loadNachocode('your-api-key', options, '${LATEST_VERSION}')`
    );
  });
});
