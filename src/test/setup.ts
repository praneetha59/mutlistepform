import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock global fetch API for JSDOM testing environment
const mockFetch = vi.fn().mockImplementation((url: string, options?: RequestInit) => {
  let body: any = {};
  if (options && options.body) {
    try {
      body = JSON.parse(options.body as string);
    } catch (e) {
      body = {};
    }
  }

  if (url.includes('/api/check-email')) {
    const isTaken = ['taken@example.com', 'test@test.com'].includes(body.email?.toLowerCase());
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ available: !isTaken }),
    } as Response);
  }

  if (url.includes('/api/check-promo')) {
    const isValid = body.code === 'SAVE10' || body.code === 'SAVE20';
    const discount = body.code === 'SAVE10' ? 0.1 : body.code === 'SAVE20' ? 0.2 : 0;
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ valid: isValid, discount }),
    } as Response);
  }

  if (url.includes('/api/submit-form')) {
    const shouldFail = body.email && body.email.toLowerCase() === 'fail@example.com';
    if (shouldFail) {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error: Database insertion failed' }),
      } as Response);
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as Response);
  }

  return Promise.reject(new Error(`Fetch error: unmocked URL path "${url}"`));
});

vi.stubGlobal('fetch', mockFetch);
export { mockFetch };
