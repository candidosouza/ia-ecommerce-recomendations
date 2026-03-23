import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  sessionStorage.clear();
  document.body.innerHTML = '';
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);
});

afterEach(() => {
  vi.restoreAllMocks();
});
