/**
 * @jest-environment node
 */
import { loadNachocode } from '../src/loadNachocode';

describe('loadNachocode (서버 환경)', () => {
  test('window가 없는 환경에서는 거부한다', async () => {
    expect(typeof window).toBe('undefined');

    await expect(loadNachocode('test-key')).rejects.toThrow(
      '[Nachocode] This SDK cannot be run in a server-side environment.'
    );
  });
});
