CREATE EXTENSION IF NOT EXISTS vector;
CREATE INDEX IF NOT EXISTS document_knowledge_embedding_idx ON "DocumentKnowledge" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);