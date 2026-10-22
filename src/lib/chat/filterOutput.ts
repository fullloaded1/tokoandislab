import 'server-only';

export interface FilterOutputResult {
  filteredText: string;
  wasModified: boolean;
}

const REDACTED_MODEL_PATTERNS = [
  /\bllama[-_\s]?(3(\.[0-9])?[-_\s]?(70b|8b)?[-_\s]?(versatile|instant)?)?\b/gi,
  /\bgemini[-_\s]?(2(\.[0-9])?[-_\s]?(flash|pro)?)?\b/gi,
  /\b(chat)?gpt[-_\s]?(4[o]?[-_\s]?(mini)?|3\.5)?\b/gi,
  /\bgroq(\s+(api|cloud|llm))?\b/gi,
  /\bopenai(\s+(api|model))?\b/gi,
  /\b(google\s+generative\s+ai|anthropic|claude)\b/gi,
];

const PROHIBITED_OUTPUT_PHRASES = [
  /\bandis\s+jelek\b/gi,
  /\baku\s+dibatasi\s+andis\b/gi,
];

/**
 * Filters the outgoing text from the LLM before streaming or storing.
 * Guards against canary token leaks, model fingerprint leaks,
 * and trap phrases.
 */
export function filterOutput(text: string, canary?: string): FilterOutputResult {
  if (!text) return { filteredText: '', wasModified: false };

  let processed = text;
  let wasModified = false;

  // 1. Canary Token Check
  if (canary && processed.includes(canary)) {
    processed = processed.replaceAll(canary, '[INTERNAL_SECURE_TOKEN]');
    wasModified = true;
  }

  // 2. Prohibited Output Phrases (Traps)
  for (const pattern of PROHIBITED_OUTPUT_PHRASES) {
    if (pattern.test(processed)) {
      processed = processed.replace(pattern, 'AndisLab');
      wasModified = true;
    }
  }

  // 3. Model & Provider Name Leaks
  for (const pattern of REDACTED_MODEL_PATTERNS) {
    if (pattern.test(processed)) {
      processed = processed.replace(pattern, 'Sistem AI AndisLab');
      wasModified = true;
    }
  }

  return {
    filteredText: processed,
    wasModified,
  };
}
