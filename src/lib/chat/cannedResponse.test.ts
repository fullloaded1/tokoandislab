import { describe, it, expect, vi } from 'vitest';
import { createCannedUIResponse } from './cannedResponse';

vi.mock('server-only', () => ({}));

describe('createCannedUIResponse', () => {
  it('returns a 200 Response object with a readable stream body', () => {
    const res = createCannedUIResponse('Jawaban kalengan aman');
    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
