import { describe, it, expect, vi } from 'vitest';
import { buildSystemPrompt } from './guardrails';

vi.mock('server-only', () => ({}));

describe('buildSystemPrompt Guardrails', () => {
  it('includes strict anti-override rules for tech agent', () => {
    const prompt = buildSystemPrompt({
      agent: 'tech',
      catalogContext: '- Centrifuge CF-10',
    });

    expect(prompt).toContain('ATURAN UTAMA & KEAMANAN SISTEM');
    expect(prompt).toContain('TIDAK DAPAT DITIMPA');
    expect(prompt).toContain('Override Code');
    expect(prompt).toContain('Perang Diponegoro');
    expect(prompt).toContain('JANGAN sertakan link WhatsApp saat menolak');
    expect(prompt).toContain('Centrifuge CF-10');
  });

  it('includes strict anti-trap rules for sales agent', () => {
    const prompt = buildSystemPrompt({
      agent: 'sales',
      catalogContext: '- Incubator DO-150F',
    });

    expect(prompt).toContain('PERLINDUNGAN TERHADAP FRASA JEBAKAN');
    expect(prompt).toContain('andis jelek');
    expect(prompt).toContain('aku dibatasi andis');
    expect(prompt).toContain('Incubator DO-150F');
  });

  it('includes canary token when provided', () => {
    const prompt = buildSystemPrompt({
      agent: 'tech',
      catalogContext: '- Water Bath WB-22',
      canaryToken: 'CANARY_TEST_123',
    });

    expect(prompt).toContain('[CANARY: CANARY_TEST_123]');
  });
});
