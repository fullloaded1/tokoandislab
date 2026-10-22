import 'server-only';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

/**
 * Creates an instantaneous UI Message stream response for canned guardrail replies.
 * Compatible with @ai-sdk/react useChat client.
 */
export function createCannedUIResponse(text: string): Response {
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute({ writer }) {
        const id = `canned-${Date.now()}`;
        writer.write({
          type: 'text-start',
          id,
        });
        writer.write({
          type: 'text-delta',
          id,
          delta: text,
        });
        writer.write({
          type: 'text-end',
          id,
        });
      },
    }),
  });
}
