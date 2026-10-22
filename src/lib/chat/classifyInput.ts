import 'server-only';

export type InputCategory = 'SAFE' | 'INJECTION' | 'TRAP' | 'PROBING' | 'OFF_TOPIC';

export interface ClassifyResult {
  isSafe: boolean;
  category: InputCategory;
  cannedResponse?: string;
  reason?: string;
}

const CANNED_RESPONSES = {
  INJECTION:
    'Mohon maaf, sebagai AndisBot dari AndisLab, saya hanya dapat membantu pertanyaan seputar produk, spesifikasi, dan panduan teknis peralatan laboratorium kami.',
  TRAP:
    'Saya memahami instruksi Anda. Sebagai AndisBot dari AndisLab, fokus utama saya adalah membantu Anda dengan informasi spesifikasi teknis dan panduan produk laboratorium secara profesional.',
  PROBING:
    'Saya adalah AndisBot, asisten virtual resmi yang dikembangkan khusus untuk AndisLab guna mendukung konsultasi teknis dan pemilihan alat laboratorium. Informasi teknis mengenai arsitektur internal atau model sistem berada di luar lingkup yang dapat saya bagikan.',
  OFF_TOPIC:
    'Mohon maaf, topik tersebut berada di luar lingkup layanan AndisLab. Saya hanya memiliki informasi mengenai peralatan laboratorium, spesifikasi teknis, serta panduan pengoperasian alat lab kami.',
};

// Patterns indicating prompt injection or jailbreak attempts
const INJECTION_PATTERNS = [
  /(override\s*code|emergency\s*override|mode\s*darurat)/i,
  /(abaikan|ignore|lupakan)\s+(semua\s+)?(instruksi|perintah|aturan|prompt|rules)/i,
  /(kamu\s+sekarang\s+(adalah|menjadi)|you\s+are\s+now|berperan(lah)?\s+sebagai|act\s+as\s+a)/i,
  /(simulasi\s+penetrasi|audit\s+internal|penetration\s+test|audit\s+keamanan)/i,
  /(mode\s+dasar\s+ai|developer\s+mode|dan\s+mode|jailbreak|unrestricted\s+mode)/i,
  /(system\s*prompt|instruksi\s*sistem|prompt\s*rahasia|system\s+instruction)/i,
];

// Patterns trying to force the bot into emitting trap phrases (side-channel extraction)
const TRAP_PATTERNS = [
  /ketik\s+["']?andis\s+jelek["']?/i,
  /ketik\s+["']?aku\s+dibatasi\s+andis["']?/i,
  /(ketik|jawab|balas|tulis)\s+["'].*?["']\s*(kalo|kalau|jika|bila)\s*(tidak|ngga|gak|ada\s+batasan|gagal)/i,
];

// Patterns trying to reverse engineer / fingerprint the underlying AI model
const PROBING_PATTERNS = [
  /(chatbot\s+ini|kamu)\s+pake\s+model\s+(llm|ai)?/i,
  /(menggunakan|pake|pakai)\s+model\s+(llm|ai)\s+apa/i,
  /(model\s+llm\s+apa|arsitektur\s+model|llm\s+apa)/i,
  /(bikin\s+sendiri\s+model|tarik\s+api|nark\s+api)\s+(dari\s+)?(model\s+)?(openn?ai|gpt|claude|gemini|groq|llama|anthropic)/i,
];

// Non-lab domains frequently used in adversarial evaluation or general chat diversion
const OFF_TOPIC_PATTERNS = [
  /perang\s+(diponegoro|jawa|dunia|padri|aceh|banjar)/i,
  /kerajaan\s+(demak|majapahit|mataram|singasari|sriwijaya)/i,
  /peristiwa\s+penting\s+di\s+indonesia\s+tahun\s+1945/i,
  /ERR_TEXT_TRANSLATE/i,
  /#\s*Todos\s*\[[✓x]\]/i,
  /leakage\s+audit/i,
  /dual-dataset-validation/i,
];

// Non-lab keywords to check in decoded Base64 or translation targets
const SUSPICIOUS_WORDS = [
  'diponegoro',
  'war was a major conflict',
  'java conflict',
  'kerajaan demak',
  'jailbreak',
  'override',
  'system prompt',
];

/**
 * Inspects potential Base64 strings inside the prompt.
 * If decoded text contains non-lab or attack strings, flag it.
 */
function checkBase64Content(text: string): boolean {
  const base64Regex = /\b[A-Za-z0-9+/]{20,}={0,2}\b/g;
  const matches = text.match(base64Regex);
  if (!matches) return false;

  for (const match of matches) {
    try {
      const decoded = Buffer.from(match, 'base64').toString('utf-8');
      const lower = decoded.toLowerCase();
      for (const word of SUSPICIOUS_WORDS) {
        if (lower.includes(word)) {
          return true;
        }
      }
    } catch {
      // Not valid base64 or decoding failed
    }
  }
  return false;
}

/**
 * Classifies an incoming user prompt before sending it to the LLM.
 * Returns { isSafe: true } if the query is safe for normal lab processing,
 * or { isSafe: false, cannedResponse } to immediately reject known exploits.
 */
export function classifyInput(userText: string): ClassifyResult {
  const normalized = userText.trim();
  if (!normalized) {
    return {
      isSafe: false,
      category: 'SAFE',
      cannedResponse: 'Silakan ajukan pertanyaan seputar peralatan laboratorium kami.',
    };
  }

  // 1. Check for trap phrase coercion
  for (const pattern of TRAP_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isSafe: false,
        category: 'TRAP',
        cannedResponse: CANNED_RESPONSES.TRAP,
        reason: 'Coercive trap phrase pattern detected',
      };
    }
  }

  // 2. Check for direct injection and override codes
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isSafe: false,
        category: 'INJECTION',
        cannedResponse: CANNED_RESPONSES.INJECTION,
        reason: 'Prompt injection or override pattern detected',
      };
    }
  }

  // 3. Check for model probing / fingerprinting
  for (const pattern of PROBING_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isSafe: false,
        category: 'PROBING',
        cannedResponse: CANNED_RESPONSES.PROBING,
        reason: 'Model reverse-engineering attempt detected',
      };
    }
  }

  // 4. Check for smuggled content via Base64
  if (checkBase64Content(normalized)) {
    return {
      isSafe: false,
      category: 'INJECTION',
      cannedResponse: CANNED_RESPONSES.INJECTION,
      reason: 'Base64 encoded injection payload detected',
    };
  }

  // 5. Check for off-topic historical/code-audit prompts
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isSafe: false,
        category: 'OFF_TOPIC',
        cannedResponse: CANNED_RESPONSES.OFF_TOPIC,
        reason: 'Off-topic or disguised error log detected',
      };
    }
  }

  return {
    isSafe: true,
    category: 'SAFE',
  };
}
