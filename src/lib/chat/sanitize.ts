import 'server-only';
import { z } from 'zod';

export type ChatAgent = 'sales' | 'tech';

export interface CleanChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SanitizedChatRequest {
  ok: true;
  agent: ChatAgent;
  messages: CleanChatMessage[];
  lastUserMessage: string;
}

export interface SanitizedChatError {
  ok: false;
  error: string;
}

export type SanitizeResult = SanitizedChatRequest | SanitizedChatError;

/**
 * Strips zero-width invisible characters and dangerous control codes
 * while preserving standard whitespace (newline, carriage return, tab).
 */
export function cleanText(input: string): string {
  if (!input) return '';
  return input
    // Strip zero-width spaces, joiners, BOM
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Strip non-printable ASCII control characters (keep \t, \n, \r)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

const RawMessageSchema = z.object({
  role: z.string(),
  content: z.union([z.string(), z.any()]).optional(),
  parts: z.array(z.any()).optional(),
});

const RawRequestSchema = z.object({
  agent: z.string().optional(),
  messages: z.array(z.unknown()).optional(),
});

/**
 * Validates and sanitizes incoming chat request payloads from the client.
 * Enforces role restrictions (only user/assistant), history bounds,
 * character length bounds, and invisible smuggling characters removal.
 */
export function sanitizeChatRequest(body: unknown): SanitizeResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Format permintaan tidak valid' };
  }

  const parsed = RawRequestSchema.safeParse(body);
  if (!parsed.success || !Array.isArray(parsed.data.messages) || parsed.data.messages.length === 0) {
    return { ok: false, error: 'Pesan tidak boleh kosong' };
  }

  const rawAgent = parsed.data.agent?.toLowerCase();
  const agent: ChatAgent = rawAgent === 'tech' ? 'tech' : 'sales';

  const cleanMessages: CleanChatMessage[] = [];

  for (const item of parsed.data.messages) {
    const msgParse = RawMessageSchema.safeParse(item);
    if (!msgParse.success) continue;

    const role = msgParse.data.role.toLowerCase();
    // DEFENSE: Strictly allow ONLY 'user' and 'assistant'. Discard 'system', 'developer', 'tool'
    if (role !== 'user' && role !== 'assistant') {
      continue;
    }

    let textContent = '';
    if (Array.isArray(msgParse.data.parts)) {
      textContent = msgParse.data.parts
        .map((p: any) => (p && typeof p.text === 'string' ? p.text : ''))
        .join('');
    } else if (typeof msgParse.data.content === 'string') {
      textContent = msgParse.data.content;
    }

    const cleaned = cleanText(textContent);
    if (!cleaned) continue;

    // Limit individual message length to prevent token-exhaustion DOS
    const boundedText = cleaned.slice(0, 1000);

    cleanMessages.push({
      role: role as 'user' | 'assistant',
      content: boundedText,
    });
  }

  if (cleanMessages.length === 0) {
    return { ok: false, error: 'Pesan tidak boleh kosong' };
  }

  // Bound history to recent 12 messages
  const boundedMessages = cleanMessages.slice(-12);

  const lastUserMsgObj = [...boundedMessages].reverse().find((m) => m.role === 'user');
  const lastUserMessage = lastUserMsgObj ? lastUserMsgObj.content : '';

  if (!lastUserMessage.trim()) {
    return { ok: false, error: 'Pesan pengguna tidak boleh kosong' };
  }

  return {
    ok: true,
    agent,
    messages: boundedMessages,
    lastUserMessage,
  };
}
