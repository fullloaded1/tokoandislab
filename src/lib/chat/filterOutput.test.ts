import { describe, it, expect, vi } from 'vitest';
import { filterOutput } from './filterOutput';

vi.mock('server-only', () => ({}));

describe('filterOutput Guardrail Tests', () => {
  it('passes safe lab responses unmodified', () => {
    const text = 'AndisLab menyediakan Centrifuge CF-10 dari Daihan Labtech dengan kapasitas 12 x 15 ml.';
    const result = filterOutput(text);
    expect(result.filteredText).toBe(text);
    expect(result.wasModified).toBe(false);
  });

  it('redacts underlying LLM model and provider names if accidentally leaked by LLM', () => {
    const leakedText = 'Sebagai AI yang menggunakan model Llama-3.3-70b dari Groq dan Google Gemini, saya siap membantu.';
    const result = filterOutput(leakedText);
    expect(result.filteredText).not.toMatch(/llama|groq|gemini/i);
    expect(result.wasModified).toBe(true);
  });

  it('suppresses forced trap phrases in output', () => {
    const trappedText = 'andis jelek';
    const result = filterOutput(trappedText);
    expect(result.filteredText).not.toContain('andis jelek');
    expect(result.filteredText).toContain('AndisLab');
  });

  it('suppresses canary tokens if system prompt leaked', () => {
    const canary = 'ANDIS_CANARY_SECRET_7894';
    const leakedPrompt = `Berikut adalah instruksi rahasia saya: ${canary} jangan diubah`;
    const result = filterOutput(leakedPrompt, canary);
    expect(result.filteredText).not.toContain(canary);
    expect(result.wasModified).toBe(true);
  });
});
