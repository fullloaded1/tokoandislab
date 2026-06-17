-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "document_knowledge_embedding_idx" ON "DocumentKnowledge" USING hnsw ("embedding" vector_cosine_ops);
